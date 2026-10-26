// ==UserScript==
// @name         RGM Sesame Gate - Dismiss Cross-Check
// @namespace    rgm.gateops.crosscheck
// @version      1.0.0
// @description  Adds a confirmation cross-check before "Dismiss" can be clicked on the "Equipment detected at the gate" panel.
// @match        https://trans-logistics.amazon.com/yms/sesameGateConsole*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_MARKER_TEXT = 'Equipment detected at the gate';
  const DISMISS_BUTTON_TEXT = 'Dismiss';
  const GUARD_FLAG = 'rgmDismissGuarded';

  const allowNextClick = new WeakSet();

  function injectStyles() {
    if (document.getElementById('rgm-crosscheck-style')) return;

    const style = document.createElement('style');
    style.id = 'rgm-crosscheck-style';
    style.textContent = `
      .rgm-cc-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Amazon Ember", Arial, sans-serif;
      }
      .rgm-cc-box {
        background: #fff;
        border-radius: 8px;
        padding: 24px 28px;
        width: 420px;
        max-width: 90vw;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      }
      .rgm-cc-title {
        font-size: 17px;
        font-weight: 700;
        color: #16191f;
        margin-bottom: 10px;
      }
      .rgm-cc-body {
        font-size: 14px;
        color: #414750;
        line-height: 1.4;
        margin-bottom: 16px;
      }
      .rgm-cc-checkline {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 18px;
        font-size: 13px;
        color: #414750;
      }
      .rgm-cc-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .rgm-cc-btn {
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        border: 1px solid #879596;
      }
      .rgm-cc-btn-cancel {
        background: #fff;
        color: #16191f;
      }
      .rgm-cc-btn-confirm {
        background: #0972d3;
        color: #fff;
        border-color: #0972d3;
      }
      .rgm-cc-btn-confirm:disabled {
        background: #c8ccd0;
        border-color: #c8ccd0;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  function showCrossCheckModal(onConfirm) {
    injectStyles();

    const overlay = document.createElement('div');
    overlay.className = 'rgm-cc-overlay';
    overlay.innerHTML = `
      <div class="rgm-cc-box" role="dialog" aria-modal="true" aria-labelledby="rgm-cc-title">
        <div class="rgm-cc-title" id="rgm-cc-title">Confirm dismiss</div>
        <div class="rgm-cc-body">
          You are about to dismiss an "Equipment detected" event without checking a
          vehicle in or out. This will close the transaction with no record of a
          check-in/check-out. Only do this if no vehicle is actually present at this
          lane.
        </div>
        <label class="rgm-cc-checkline">
          <input type="checkbox" id="rgm-cc-checkbox" style="margin-top:2px;">
          <span>I have visually verified (camera/on-site) that no vehicle is present at this gate.</span>
        </label>
        <div class="rgm-cc-actions">
          <button type="button" class="rgm-cc-btn rgm-cc-btn-cancel" id="rgm-cc-cancel">Cancel</button>
          <button type="button" class="rgm-cc-btn rgm-cc-btn-confirm" id="rgm-cc-confirm" disabled>Confirm Dismiss</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const checkbox = overlay.querySelector('#rgm-cc-checkbox');
    const confirmBtn = overlay.querySelector('#rgm-cc-confirm');
    const cancelBtn = overlay.querySelector('#rgm-cc-cancel');

    checkbox.addEventListener('change', () => {
      confirmBtn.disabled = !checkbox.checked;
    });

    function close() {
      overlay.remove();
    }

    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close();
    });

    confirmBtn.addEventListener('click', () => {
      if (!checkbox.checked) return;
      close();
      onConfirm();
    });
  }

  function isInEquipmentPanel(element) {
    let node = element;

    for (let i = 0; i < 8 && node; i += 1) {
      if (node.textContent && node.textContent.includes(PANEL_MARKER_TEXT)) {
        return true;
      }
      node = node.parentElement;
    }

    return false;
  }

  function guardDismissButton(button) {
    if (button.dataset[GUARD_FLAG]) return;
    button.dataset[GUARD_FLAG] = '1';

    button.addEventListener('click', (event) => {
      if (allowNextClick.has(button)) {
        allowNextClick.delete(button);
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      showCrossCheckModal(() => {
        allowNextClick.add(button);
        button.click();
      });
    }, true);
  }

  function scan() {
    document.querySelectorAll('button').forEach((button) => {
      const text = button.textContent && button.textContent.trim();

      if (text === DISMISS_BUTTON_TEXT && isInEquipmentPanel(button)) {
        guardDismissButton(button);
      }
    });
  }

  scan();

  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
})();
