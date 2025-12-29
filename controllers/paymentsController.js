const sequelize = require('../config/database');
const crypto = require('crypto');

function requireEnv(name) {
  if (!process.env[name]) throw new Error(`Falta variable de entorno ${name}`);
  return process.env[name];
}

async function getMpSdk() {
  const accessToken = requireEnv('MP_ACCESS_TOKEN');
  const { MercadoPagoConfig, Preference, Payment } = await import('mercadopago');
  const client = new MercadoPagoConfig({ accessToken });
  return {
    preference: new Preference(client),
    payment: new Payment(client),
  };
}

function verifyWebhookSignature(req, paymentId) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; 

  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];

  if (!xSignature || !xRequestId) return false;

  const parts = String(xSignature).split(',');
  let ts = null;
  let v1 = null;
  for (const p of parts) {
    const [k, v] = p.split('=').map(s => s.trim());
    if (k === 'ts') ts = v;
    if (k === 'v1') v1 = v;
  }
  if (!ts || !v1) return false;

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
  const calculated = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(v1));
}



// Obtener cuotas activas de un usuario
const getActiveFees = async (req, res) => {
  try {
    // Si es alumno id del token
    const isAlumno = Number(req.user?.id_rol) === 3;
    const id_usuario = isAlumno ? req.user.id_usuario : req.query.id_usuario;

    if (!id_usuario) {
      return res.status(400).json({ error: 'Falta el parámetro id_usuario.' });
    }

    const cuotas = await sequelize.query(
      'CALL GetActiveFees(:id_usuario, CURDATE())',
      { replacements: { id_usuario } }
    );

    return res.json({ id_usuario, cuotas });
  } catch (error) {
    console.error('Error al obtener cuotas activas:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Registrar nueva cuota (usa info del plan automáticamente)
const registerFee = async (req, res) => {
  const { id_usuario, id_plan, metodo_pago, pagado } = req.body;

  if (!id_usuario || !id_plan || !metodo_pago || pagado == null) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL RegisterFee(:id_usuario, :id_plan, :metodo_pago, :pagado)',
      { replacements: { id_usuario, id_plan, metodo_pago, pagado } }
    );
    res.json({ message: 'Cuota registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Pagar cuota existente (admin/profe)
const payFee = async (req, res) => {
  const { id_cuota, metodo_pago } = req.body;

  if (!id_cuota || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL PayFee(:id_cuota, :metodo_pago)',
      { replacements: { id_cuota, metodo_pago } }
    );
    res.json({ message: 'Cuota pagada correctamente.' });
  } catch (error) {
    console.error('Error al pagar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



// Alumno logueado crea la preferencia para pagar su cuota
const createMpPreference = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_cuota } = req.body;

    if (!id_cuota) return res.status(400).json({ error: 'Falta id_cuota.' });

    // Traer cuota + plan + monto
    const [rows] = await sequelize.query(
      `
      SELECT
        c.id_cuota, c.id_usuario, c.estado_pago, c.id_plan,
        p.nombre AS plan_nombre, p.monto AS plan_monto, p.activa AS plan_activa
      FROM cuotas c
      JOIN planes p ON p.id_plan = c.id_plan
      WHERE c.id_cuota = :id_cuota
      LIMIT 1
      `,
      { replacements: { id_cuota } }
    );

    const cuota = rows?.[0];
    if (!cuota) return res.status(404).json({ error: 'Cuota no encontrada.' });

    if (Number(cuota.id_usuario) !== Number(id_usuario)) {
      return res.status(403).json({ error: 'La cuota no pertenece al alumno logueado.' });
    }

    if (cuota.estado_pago !== 'Pendiente') {
      return res.status(400).json({ error: 'La cuota no está pendiente.' });
    }

    if (Number(cuota.plan_activa) !== 1) {
      return res.status(400).json({ error: 'El plan no está activo.' });
    }

    const monto = Number(cuota.plan_monto);
    if (!Number.isFinite(monto) || monto <= 0) {
      return res.status(400).json({ error: 'Monto inválido.' });
    }

    // External reference: cuota + user (trazabilidad + idempotencia)
    const external_reference = `cuota_${id_cuota}_user_${id_usuario}`;

    // Pre-registrar auditoría con monto “congelado”
    await sequelize.query(
      `
      INSERT INTO mp_pagos (id_usuario, id_cuota, id_plan, external_reference, status, amount, currency)
      VALUES (:id_usuario, :id_cuota, :id_plan, :external_reference, 'created', :amount, 'ARS')
      ON DUPLICATE KEY UPDATE
        status = 'created',
        amount = VALUES(amount),
        currency = VALUES(currency),
        updated_at = CURRENT_TIMESTAMP
      `,
      {
        replacements: {
          id_usuario,
          id_cuota,
          id_plan: cuota.id_plan,
          external_reference,
          amount: monto,
        }
      }
    );

    const FRONTEND_URL = requireEnv('FRONTEND_URL');
    const WEBHOOK_URL = `https://backturnero-vvk6.onrender.com/api/payments/mp/webhook`;

    const { preference } = await getMpSdk();

    const pref = await preference.create({
      body: {
        items: [
          {
            title: `${cuota.plan_nombre} - Cuota #${id_cuota}`,
            quantity: 1,
            unit_price: monto,
            currency_id: 'ARS',
          }
        ],
        external_reference,
        metadata: {
          id_usuario,
          id_cuota,
          id_plan: cuota.id_plan,
        },
        back_urls: {
          success: `${FRONTEND_URL}/payments/success`,
          pending: `${FRONTEND_URL}/payments/pending`,
          failure: `${FRONTEND_URL}/payments/failure`,
        },
        auto_return: 'approved',
        notification_url: WEBHOOK_URL,
      }
    });

    // Guardar preference_id
    if (pref?.id) {
      await sequelize.query(
        `UPDATE mp_pagos SET preference_id = :preference_id WHERE external_reference = :external_reference`,
        { replacements: { preference_id: pref.id, external_reference } }
      );
    }

    return res.json({
      id_usuario,           
      id_cuota,
      external_reference,
      preference_id: pref?.id || null,
      init_point: pref?.init_point || null,
    });

  } catch (error) {
    console.error('Error createMpPreference:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Webhook: MP avisa cambios (consultamos payment y si approved → PayFee)
const mpWebhook = async (req, res) => {
  try {
    const { type, data } = req.body || {};
    const paymentId = data?.id;

    // Si no es evento payment, lo ignoramos
    if (!paymentId || type !== 'payment') {
      return res.status(200).json({ ok: true, ignored: true });
    }

    // Validación firma (si configuraste MP_WEBHOOK_SECRET)
    if (!verifyWebhookSignature(req, String(paymentId))) {
      return res.status(401).json({ ok: false });
    }

    const { payment } = await getMpSdk();
    const pay = await payment.get({ id: paymentId });

    const status = pay?.status || null;
    const status_detail = pay?.status_detail || null;
    const external_reference = pay?.external_reference || null;

    if (external_reference) {
      await sequelize.query(
        `
        UPDATE mp_pagos
        SET
          mp_payment_id = :mp_payment_id,
          status = :status,
          status_detail = :status_detail,
          payment_method_id = :payment_method_id,
          payment_type_id = :payment_type_id,
          date_created = :date_created,
          date_approved = :date_approved,
          raw_notification = CAST(:raw_notification AS JSON),
          raw_payment = CAST(:raw_payment AS JSON)
        WHERE external_reference = :external_reference
        `,
        {
          replacements: {
            external_reference,
            mp_payment_id: paymentId,
            status,
            status_detail,
            payment_method_id: pay?.payment_method_id || null,
            payment_type_id: pay?.payment_type_id || null,
            date_created: pay?.date_created ? new Date(pay.date_created) : null,
            date_approved: pay?.date_approved ? new Date(pay.date_approved) : null,
            raw_notification: JSON.stringify(req.body || {}),
            raw_payment: JSON.stringify(pay || {}),
          }
        }
      );
    }

    if (status === 'approved' && external_reference) {
      const match = external_reference.match(/^cuota_(\d+)_user_(\d+)$/);
      const id_cuota = match ? Number(match[1]) : null;

      if (id_cuota) {
        await sequelize.query(
          "CALL PayFee(:id_cuota, 'mercadopago')",
          { replacements: { id_cuota } }
        );
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error mpWebhook:', error);
    return res.status(200).json({ ok: true, error: true });
  }
};

module.exports = {
  getActiveFees,
  registerFee,
  payFee,
  createMpPreference,
  mpWebhook,
};

