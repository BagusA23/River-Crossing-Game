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

        if (charactersOnBoat.length < 2 && !charactersOnBoat.includes(character)) {
            boat.appendChild(character); // Tambahkan karakter ke kapal
            charactersOnBoat.push(character); // Lacak karakter di kapal
            statusText.textContent = "karakter ditambahkan ke kapal. Ready to move!";
        } else if (charactersOnBoat.includes(character)) {
            const currentShore = isBoatOnLeft ? leftShore : rightShore;
            currentShore.appendChild(character); // Hapus karakter dari kapal
            charactersOnBoat = charactersOnBoat.filter(c => c !== character); // Perbarui pelacakan
            statusText.textContent = "karakter di hapus dari kapal.";
        }
    });
});

// Tambahkan event listener untuk tombol kapal
moveBoatButton.addEventListener('click', () => {
    if (isGameOver) return; // Jika Game Over, hentikan semua aksi

    if (charactersOnBoat.length === 0) {
        statusText.textContent = "tambahkan karakter ke kapal terlebih dahulu!";
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

// Fungsi untuk mengakhiri permainan
function endGame() {
    isGameOver = true; // Aktifkan status Game Over
    // Nonaktifkan tombol kapal
    moveBoatButton.disabled = true;
    // Tambahkan gaya ke tombol untuk menunjukkan bahwa tombol dinonaktifkan
    moveBoatButton.classList.add('disabled');
    // Tampilkan pesan status
    statusText.textContent += " Refresh the page to restart the game.";
}
