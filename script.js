let nombre = "";
let nivel = 1;
let puntos = 0;
let tiempo = 30;
let combo = 0;

let timer;
let dragged = null;

const feed = document.getElementById("feed");

const sonidoOk = document.getElementById("ok");
const sonidoFail = document.getElementById("fail");
const sonidoMove = document.getElementById("move");

/* LOADER */

window.onload = () => {

    setTimeout(() => {

        document.getElementById("loader").style.display = "none";

    }, 3000);

};

/* INICIAR */

function iniciarJuego() {

    nombre = document.getElementById("nombre").value;

    if (!nombre) {

        alert("Ingresa tu nombre");
        return;

    }

    document.getElementById("inicio")
        .classList.add("oculto");

    document.getElementById("tutorial")
        .classList.remove("oculto");

}

/* COMENZAR */

function comenzarJuego() {

    document.getElementById("tutorial")
        .classList.add("oculto");

    document.getElementById("juego")
        .classList.remove("oculto");

    nivel = 1;
    puntos = 0;
    tiempo = 30;
    combo = 0;

    cargarNivel();
    iniciarTiempo();

}

/* GENERAR HORAS */

function generarHoras(cantidad) {

    let base = 8;
    let lista = [];

    for (let i = 0; i < cantidad; i++) {

        let minuto = Math.floor(Math.random() * 60);

        if (minuto < 10) {
            minuto = "0" + minuto;
        }

        lista.push({

            tiempo: base + ":" + minuto,
            orden: i + 1

        });

        base++;
    }

    return lista;
}

/* CARGAR NIVEL */

function cargarNivel() {

    feed.innerHTML = "";

    document.getElementById("nivel")
        .innerText = "Nivel " + nivel;

    document.getElementById("puntos")
        .innerText = puntos;

    document.getElementById("tiempo")
        .innerText = tiempo;

    document.getElementById("combo")
        .innerText = combo;

    document.getElementById("barraNivel")
        .style.width = (nivel / 7) * 100 + "%";

    let cantidad = nivel + 3;

    let posts = generarHoras(cantidad);

    posts.sort(() => Math.random() - 0.5);

    posts.forEach(p => {

        const div = document.createElement("div");

        div.className = "post";

        div.draggable = true;

        div.dataset.orden = p.orden;

        div.innerHTML = `

        <div class="avatar"></div>

        <div class="contenido">

            <h3>@usuario_${p.orden}</h3>

            <p>
            Publicación digital detectada en la línea temporal.
            Organiza correctamente la secuencia.
            </p>

            <span class="hora">${p.tiempo}</span>

        </div>

        `;

        div.addEventListener("dragstart", () => {

            dragged = div;

        });

        div.addEventListener("dragover", e => {

            e.preventDefault();

        });

        div.addEventListener("drop", () => {

            if (dragged && dragged !== div) {

                swap(dragged, div);

                sonidoMove.currentTime = 0;
                sonidoMove.play();

            }

        });

        feed.appendChild(div);

    });

}

function swap(a, b) {

    let temp = document.createElement("div");

    a.parentNode.insertBefore(temp, a);

    b.parentNode.insertBefore(a, b);

    temp.parentNode.insertBefore(b, temp);

    temp.remove();
}

/* VERIFICAR */

function verificar() {

    const items = document.querySelectorAll(".post");

    let correcto = true;

    items.forEach((item, i) => {

        if (parseInt(item.dataset.orden) !== i + 1) {

            correcto = false;

        }

    });

    if (correcto) {

        combo++;

        puntos += 10 * combo;

        tiempo += 10;

        nivel++;

        sonidoOk.currentTime = 0;
        sonidoOk.play();

        if (nivel > 7) {

            terminarJuego();

        } else {

            cargarNivel();
        }

    } else {

        combo = 0;

        sonidoFail.currentTime = 0;
        sonidoFail.play();

        terminarJuego();
    }

}

/* TIEMPO */

function iniciarTiempo() {

    clearInterval(timer);

    timer = setInterval(() => {

        tiempo--;

        document.getElementById("tiempo")
            .innerText = tiempo;

        if (tiempo <= 0) {

            terminarJuego();

        }

    }, 1000);

}

/* FINAL */

function terminarJuego() {

    clearInterval(timer);

    document.getElementById("juego")
        .classList.add("oculto");

    document.getElementById("fin")
        .classList.remove("oculto");

    document.getElementById("finalTexto")
        .innerHTML = `

        <h2>${nombre}</h2>

        <h3>⭐ Puntaje: ${puntos}</h3>

        <h3>📈 Nivel alcanzado: ${nivel}</h3>

        <h3>🔥 Combo: ${combo}</h3>

    `;
}

/* REINICIAR */

function reiniciar() {

    location.reload();

}

/* PARTICULAS */

const canvas =
    document.getElementById("particles");

const ctx =
    canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;

        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 3 + 1;

        this.speedX = Math.random() - 0.5;

        this.speedY = Math.random() - 0.5;

        this.color =
            `hsl(${Math.random() * 360},100%,60%)`;
    }

    update() {

        this.x += this.speedX;

        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width)
            this.speedX *= -1;

        if (this.y < 0 || this.y > canvas.height)
            this.speedY *= -1;
    }

    draw() {

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

function connect() {

    for (let a = 0; a < particlesArray.length; a++) {

        for (let b = a; b < particlesArray.length; b++) {

            let dx =
                particlesArray[a].x -
                particlesArray[b].x;

            let dy =
                particlesArray[a].y -
                particlesArray[b].y;

            let distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {

                ctx.strokeStyle =
                    "rgba(255,255,255,0.12)";

                ctx.beginPath();

                ctx.moveTo(
                    particlesArray[a].x,
                    particlesArray[a].y
                );

                ctx.lineTo(
                    particlesArray[b].x,
                    particlesArray[b].y
                );

                ctx.stroke();
            }
        }
    }
}

function initParticles() {

    particlesArray = [];

    for (let i = 0; i < 90; i++) {

        particlesArray.push(new Particle());

    }
}

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particlesArray.forEach(p => {

        p.update();
        p.draw();

    });

    connect();

    requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    initParticles();

});