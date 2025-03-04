// Wallet-Balance und Spieler-Daten
let walletBalance = localStorage.getItem('walletBalance') ? parseFloat(localStorage.getItem('walletBalance')) : 0;
let playerWalletAddress = null;
const yourWalletAddress = "UQCCMn_NAiSHIbKpjxVLWkboRYGw3YlfVxb8FJa0iX2mMIe0"; // Deine Wallet für Einzahlungen

// Daten für jede Karte
const cardData = JSON.parse(localStorage.getItem('cardData')) || {
    chuchu: { requiredTon: 1, baseTon: 0, dailyApi: 0.048, intervalHours: 2, intervalEarnings: 0, currentBalance: 0, totalCollected: 0, lastCollected: null, active: false },
    kev: { requiredTon: 3, baseTon: 0, dailyApi: 0.09, intervalHours: 3, intervalEarnings: 0, currentBalance: 0, totalCollected: 0, lastCollected: null, active: false },
    damon: { minTon: 10, maxTon: 50, baseTon: 0, dailyApi: 0.015, intervalHours: 4, intervalEarnings: 0, currentBalance: 0, totalCollected: 0, lastCollected: null, active: false }
};

// Spracheinstellungen
const translations = {
    en: {
        title: "TonLin's",
        "nav-home": "Home",
        "nav-earn": "Earn",
        "nav-balance": "Balance",
        "chuchu-desc": "1 TON - 4.8% API/d - every 2h earn",
        "kev-desc": "3 TON - 3% API/d - every 3h earn",
        "damon-desc": "10-50 TON - 1.5% API/d - every 4h",
        collect: "Collect",
        "total-collected": "Total Collected: ",
        "next-collection": "Next collection: ",
        "now-available": "Now available!",
        "coming-soon": "Coming Soon",
        "wallet-balance": "Wallet Balance: ",
        withdraw: "Withdraw",
        deposit: "Deposit",
        "deposit-to-card": "Deposit to Card",
        "connect-wallet": "Connect Wallet",
        "collect-wait": "You can only collect every ",
        "collect-hours": " hours! Wait a bit.",
        "withdraw-none": "Nothing to withdraw!",
        "withdraw-success": "Withdrawal: ",
        "withdraw-confirm": "Are you sure you want to withdraw ",
        "connect-wallet-first": "Please connect a wallet first!",
        "inactive": "Inactive",
        "deposit-amount": "Enter amount to deposit (10-50 TON for Damon)"
    },
    ru: {
        title: "TonLin's",
        "nav-home": "Главная",
        "nav-earn": "Заработок",
        "nav-balance": "Баланс",
        "chuchu-desc": "1 TON - 4.8% API/д - каждые 2ч",
        "kev-desc": "3 TON - 3% API/д - каждые 3ч",
        "damon-desc": "10-50 TON - 1.5% API/д - каждые 4ч",
        collect: "Собрать",
        "total-collected": "Всего собрано: ",
        "next-collection": "Следующий сбор: ",
        "now-available": "Доступно сейчас!",
        "coming-soon": "Скоро будет",
        "wallet-balance": "Баланс кошелька: ",
        withdraw: "Вывести",
        deposit: "Пополнить",
        "deposit-to-card": "Пополнить карту",
        "connect-wallet": "Подключить кошелек",
        "collect-wait": "Вы можете собирать только каждые ",
        "collect-hours": " часов! Подождите немного.",
        "withdraw-none": "Нечего выводить!",
        "withdraw-success": "Вывод: ",
        "withdraw-confirm": "Вы уверены, что хотите вывести ",
        "connect-wallet-first": "Сначала подключите кошелек!",
        "inactive": "Неактивно",
        "deposit-amount": "Введите сумму для пополнения (10-50 TON для Damon)"
    },
    tr: {
        title: "TonLin's",
        "nav-home": "Ana Sayfa",
        "nav-earn": "Kazan",
        "nav-balance": "Bakiye",
        "chuchu-desc": "1 TON - 4.8% API/g - her 2 saatte",
        "kev-desc": "3 TON - 3% API/g - her 3 saatte",
        "damon-desc": "10-50 TON - 1.5% API/g - her 4 saatte",
        collect: "Topla",
        "total-collected": "Toplam Toplanan: ",
        "next-collection": "Sonraki toplama: ",
        "now-available": "Şimdi mevcut!",
        "coming-soon": "Yakında",
        "wallet-balance": "Cüzdan Bakiyesi: ",
        withdraw: "Çek",
        deposit: "Yatır",
        "deposit-to-card": "Karta Yatır",
        "connect-wallet": "Cüzdanı Bağla",
        "collect-wait": "Sadece her ",
        "collect-hours": " saatte bir toplayabilirsiniz! Biraz bekleyin.",
        "withdraw-none": "Çekilecek bir şey yok!",
        "withdraw-success": "Çekim: ",
        "withdraw-confirm": " emin misiniz çekmek istediğinizden ",
        "connect-wallet-first": "Önce cüzdanı bağlayın!",
        "inactive": "Pasif",
        "deposit-amount": "Yatırılacak miktarı girin (Damon için 10-50 TON)"
    }
};

let currentLang = "en";

// TON Connect Initialisierung
let tonConnectUI;
if (typeof TONConnectUI === 'undefined') {
    console.error('TONConnectUI ist nicht geladen. Überprüfe, ob tonconnect-ui.min.js im Ordner ist und korrekt eingebunden ist.');
} else {
    tonConnectUI = new TONConnectUI({
        manifestUrl: 'https://csen8686.github.io/gremlins/tonconnect-manifest.json',
        twaReturnUrl: 'https://t.me/TonLinBot'
    });

    tonConnectUI.onStatusChange(wallet => {
        if (wallet) {
            playerWalletAddress = wallet.account.address;
            console.log('Wallet verbunden:', playerWalletAddress);
            document.getElementById('connectWallet').textContent = 'Wallet Connected';
        } else {
