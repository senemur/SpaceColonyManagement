import React, { useEffect } from "react";
// @ts-expect-error - JS file lacking type declarations
import { initMars3D } from "./mars3d";
import "./mars3d.css";

export function VanillaMarsGame() {
  useEffect(() => {
    // Run the vanilla JS 3D Mars scene
    const cleanup = initMars3D();

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="mars3d-container">
      <div id="scene"></div>

      {/* ===== CROSSHAIR ===== */}
      <div className="crosshair" id="crosshair">
        <span></span>
      </div>

      {/* ===== ÜST HUD ===== */}
      <div className="hud-top">
        <div className="hud-chip glass">
          <b>
            Sol <span id="solNum">412</span>
          </b>
          <small id="season">Sonbahar · Ls 52°</small>
        </div>
        <div className="hud-chip glass">
          <b>
            O₂ <span id="o2">96%</span>
          </b>
          <small id="o2bar">
            <i style={{ width: "96%" }}></i>
          </small>
        </div>
        <div className="hud-chip glass">
          <b>
            Su <span id="su">8.420 L</span>
          </b>
          <small>Yerel kullanım</small>
        </div>
        <div className="hud-chip glass">
          <b>
            Güç <span id="pwr">318 kWh</span>
          </b>
          <small>Koloni tüketimi</small>
        </div>
        <div className="spacer"></div>
        <button className="hud-chip glass cam-chip" id="camMode" title="Kamera modu (V)">
          FPS
        </button>
        <div className="hud-chip glass weather" id="weather">
          <b>−63°C</b>
          <small>Sakin · görüş iyi</small>
        </div>
        <a className="hud-btn" href="/">
          ◱ Panel
        </a>
      </div>

      {/* ===== İÇ MEKÂN GÖREV PANELİ ===== */}
      <div className="taskpanel glass" id="taskpanel" hidden></div>

      {/* ===== SOL TARAF: KİŞİ LİSTESİ ===== */}
      <aside className="roster glass" id="roster">
        <header>
          <h3>
            Mürettebat <span id="rosterCount">18</span>
          </h3>
          <button className="mini-btn" id="rosterToggle" title="Gizle">
            —
          </button>
        </header>
        <div className="roster-sub" id="rosterSub">
          — içeride · — dışarıda
        </div>
        <div className="roster-list" id="rosterList"></div>
      </aside>

      {/* ===== SAĞ TARAF: MİNİ HARİTA + SEÇİM ===== */}
      <aside className="right-col">
        <div className="minimap glass">
          <canvas id="minimap" width="220" height="220"></canvas>
          <div className="mm-label">ARES VALLIS</div>
        </div>
        <div className="inspect glass" id="inspect" hidden>
          <header>
            <b id="insName">—</b>
            <button className="mini-btn" id="insClose">
              ✕
            </button>
          </header>
          <div className="ins-role" id="insRole"></div>
          <div className="ins-rows" id="insRows"></div>
          <div className="ins-actions" id="insActions"></div>
        </div>
      </aside>

      {/* ===== ALT: YARDIM + İPUCU ===== */}
      <div className="hud-bottom">
        <div className="hint glass" id="hint">
          Yürümek için <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> · Bakış: fare · Koş: <kbd>Shift</kbd> · Kamera: <kbd>V</kbd> · Etkileşim:{" "}
          <kbd>E</kbd> · Binalara gir: kapıya yaklaş ve <kbd>E</kbd> · Görev için <kbd>E</kbd>{" "}
          basılı tut
        </div>
        <div className="toast-wrap" id="toasts"></div>
      </div>

      {/* ===== KOMUT SATIRI ===== */}
      <div className="cmdbar glass" id="cmdbar">
        <span className="cmd-label">Komut</span>
        <select id="cmdTarget"></select>
        <select id="cmdAction">
          <option value="patrol">Devriye gez</option>
          <option value="follow">Beni takip et</option>
          <option value="build">Yapıyı incele</option>
          <option value="sleep">Uyumaya git</option>
          <option value="work">İçeri gir, çalış</option>
          <option value="job">Görev istasyonuna çalış</option>
          <option value="enter">Binasına gir</option>
          <option value="outside">Uyandır, dışarı çıkar</option>
          <option value="rest">Dinlenmeye git</option>
        </select>
        <button className="cmd-btn" id="cmdSend">
          Gönder
        </button>
      </div>

      {/* ===== MOBİL KONTROL ===== */}
      <div className="touch" id="touch">
        <div className="stick" id="stickMove">
          <i></i>
        </div>
        <div className="stick right" id="stickLook">
          <i></i>
        </div>
        <button className="tbtn small" id="tbtnCam" title="Kamera modu">
          ◑
        </button>
        <button className="tbtn" id="tbtnUse">
          E
        </button>
      </div>

      {/* ===== YÜKLENİYOR ===== */}
      <div className="loader" id="loader">
        <div className="planet"></div>
        <p>Mars yüzeyi oluşturuluyor…</p>
      </div>
    </div>
  );
}
