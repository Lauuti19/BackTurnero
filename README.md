
⚙️ BackTurnero - API del Sistema de Turnos  

Backend en Node.js + Express + MySQL que gestiona turnos de gimnasios.  

 ▶️ **Pasos para ejecutarlo**  

 **1** 
```bash
git clone https://github.com/Lauuti19/BackTurnero.git
cd BackTurnero

# Crear red (si no existe)
docker network create turnero-network

# Iniciar
docker-compose up -d

## 🗃️ **Componentes Relacionados**  
Este backend depende de:  
- **[BDTurnero](https://github.com/Lauuti19/BDTurnero)** - Base de datos MySQL (`db:3306` en Docker).  

Y es consumido por:  
- **[FrontTurnero](https://github.com/Lauuti19/FrontTurnero)** - Aplicación React (`http://localhost:3000`).  

🔧 **Configuración mínima**:  
1. Primero inicia la base de datos.  
2. Luego ejecuta este backend.  
3. Por último, inicia el frontend.  
