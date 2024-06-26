import React from "react";
import useSocketData from "../stores/socketDataStore";

function accidentComposant() {
  const { socketData } = useSocketData();
  return (
    <>
      {socketData?.accident && (
        <div>
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
          <div
            style={{
              height: "100%",
              backgroundColor: "#4F5358",
              padding: "8px 20px 8px 20px",
              display: "flex",
              justifyContent: " space-between",
              borderBottom: "1px solid white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
              }}
            >
              <div style={{ fontSize: "16px" }}> Nombre de jours</div>
              <div style={{ fontSize: "12px" }}> sans accident </div>
            </div>
            <div
              style={{
                backgroundColor: "black",
                height: "30px",
                width: "75px",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "orange",
                  textAlign: "right",
                  paddingRight: "5px",
                }}
              >
                {socketData.accident.days_without_accident}
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100%",
              backgroundColor: "#4F5358",
              padding: "8px 20px 8px 20px",
              display: "flex",
              justifyContent: " space-between",
              borderBottom: "1px solid white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
              }}
            >
              <div style={{ fontSize: "16px" }}>Record de jours</div>
              <div style={{ fontSize: "12px" }}> sans accident </div>
            </div>
            <div
              style={{
                backgroundColor: "black",
                height: "30px",
                width: "75px",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#4CFF00",
                  textAlign: "right",
                  paddingRight: "5px",
                }}
              >
                {socketData.accident.record_days_without_accident}
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100%",
              backgroundColor: "#4F5358",
              padding: "8px 20px 8px 20px",
              display: "flex",
              justifyContent: " space-between",
              borderBottom: "1px solid white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
              }}
            >
              <div style={{ fontSize: "16px" }}>
                Nombre d'accident
                {socketData.accident.accidents_this_year > 1 ? "s" : " "}
              </div>
              <div style={{ fontSize: "12px" }}> depuis le 1er janvier</div>
            </div>
            <div
              style={{
                backgroundColor: "black",
                height: "30px",
                width: "45px",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#FF0000",
                  textAlign: "right",
                  paddingRight: "5px",
                }}
              >
                {socketData.accident.accidents_this_year}
              </div>
            </div>
          </div>

          <div
            style={{
              height: "100%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "red",
                padding: "5px",
                fontStyle: "italic",
              }}
            >
              La sécurité est l'affaire de tous !
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default accidentComposant;
