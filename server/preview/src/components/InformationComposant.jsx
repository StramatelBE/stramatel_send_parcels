import React from 'react'
import useSocketData from '../stores/socketDataStore';

function InformationComposant() {
  const { socketData } = useSocketData();
  return (
    <div >
      <div
            style={{
              height: "100%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "100px", height: "100%" }}
              src="/LOGO_PELLENC.png"
              alt="logo"
              className="logo"
            />
            <div
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginTop: "10px",
                color: "#4F5358",
              }}
            >
              {" "}
              Bienvenue sur le site de Pertuis
            </div>
          </div>
          <div style={{padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ fontSize: '40px' }}>{new Date().toLocaleDateString()}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
        <div style={{ paddingRight: '20px', fontSize: '40px' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div style={{ fontSize: '40px' }}>{socketData.data[0].value}°C</div>
      </div>
    </div>
  </div>

  )
}

export default InformationComposant
