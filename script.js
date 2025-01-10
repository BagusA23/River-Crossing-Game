const boat = document.getElementById('boat');
const moveBoatButton = document.getElementById('move-boat');
const statusText = document.getElementById('status');
const leftShore = document.getElementById('left-shore');
const rightShore = document.getElementById('right-shore');

let isBoatOnLeft = true;
let charactersOnBoat = [];
let isGameOver = false; // Tambahkan flag untuk memeriksa status Game Over

// Tambahkan event listener untuk karakter
document.querySelectorAll('.character').forEach(character => {
    character.addEventListener('click', () => {
        if (isGameOver) return; // Jika Game Over, hentikan semua aksi

        const currentShore = isBoatOnLeft ? leftShore : rightShore;

        if (charactersOnBoat.length < 2 && !charactersOnBoat.includes(character) && character.parentElement === currentShore) {
            boat.appendChild(character); // Tambahkan karakter ke kapal
            charactersOnBoat.push(character); // Lacak karakter di kapal
            statusText.textContent = "Karakter ditambahkan ke kapal. Ready to move!";
        } else if (charactersOnBoat.includes(character)) {
            currentShore.appendChild(character); // Hapus karakter dari kapal
            charactersOnBoat = charactersOnBoat.filter(c => c !== character); // Perbarui pelacakan
            statusText.textContent = "Karakter dihapus dari kapal.";
        } else {
            statusText.textContent = "Karakter hanya dapat diambil dari sisi tempat kapal berada.";
        }
    });
});

// Tambahkan event listener untuk tombol kapal
moveBoatButton.addEventListener('click', () => {
    if (isGameOver) return; // Jika Game Over, hentikan semua aksi

    if (charactersOnBoat.length === 0) {
        statusText.textContent = "Tambahkan karakter ke kapal terlebih dahulu!";
        return;
    }

    // Pindahkan kapal ke sisi lain
    if (isBoatOnLeft) {
        boat.style.left = '70%'; // Pindahkan kapal ke kanan
    } else {
        boat.style.left = '10%'; // Pindahkan kapal ke kiri
    }

    // Tunggu animasi selesai
    boat.addEventListener('transitionend', () => {
        // Pindahkan karakter ke pantai tujuan
        charactersOnBoat.forEach(character => {
            const newShore = isBoatOnLeft ? rightShore : leftShore;
            newShore.appendChild(character);
        });

        charactersOnBoat = []; // Kosongkan kapal
        isBoatOnLeft = !isBoatOnLeft; // Toggle posisi kapal

        // Validasi aturan permainan
        if (!validateGameRules()) {
            statusText.textContent = "Game Over! terlalu banyak perampok di kapal.";
            endGame(); // Panggil fungsi untuk mengakhiri permainan
        } else if (checkWinCondition()) {
            statusText.textContent = "Selamat! Anda telah memenangkan permainan!";
            endGame(); // Akhiri permainan setelah menang
        } else {
            statusText.textContent = "Perahu telah bergerak. Tambahkan karakter ke perahu!";
        }
    }, { once: true });
});

// Validasi aturan permainan
function validateGameRules() {
    return validateShore(leftShore) && validateShore(rightShore);
}

function validateShore(shore) {
    const soldiers = shore.querySelectorAll('.soldier').length;
    const thieves = shore.querySelectorAll('.thief').length;
    return soldiers === 0 || soldiers >= thieves;
}

// Periksa kondisi kemenangan
function checkWinCondition() {
    const totalCharacters = document.querySelectorAll('.character').length;
    const charactersOnRight = rightShore.querySelectorAll('.character').length;
    return charactersOnRight === totalCharacters;
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    isGameOver = true; // Aktifkan status Game Over
    // Nonaktifkan tombol kapal
    moveBoatButton.disabled = true;
    // Tambahkan gaya ke tombol untuk menunjukkan bahwa tombol dinonaktifkan
    moveBoatButton.classList.add('disabled');
    // Tambahkan pesan status jika belum ada
    if (!statusText.textContent.includes("Refresh the page")) {
        statusText.textContent += " Refresh the page to restart the game.";
    }
}
