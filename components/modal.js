function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var abrirComoJogarBtn = document.getElementById("abrirComoJogarModal");
    if (abrirComoJogarBtn) {
        abrirComoJogarBtn.addEventListener("click", function() {
            openModal('comoJogarModal');
        });
    }

    var abrirHistoriaBtn = document.getElementById("abrirHistoriaModal");
    if (abrirHistoriaBtn) {
        abrirHistoriaBtn.addEventListener("click", function() {
            openModal('historiaModal');
        });
    }


    var fecharModais = document.getElementsByClassName("close");
    for (var i = 0; i < fecharModais.length; i++) {
        fecharModais[i].addEventListener("click", function() {
            var modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    }


    window.onclick = function(event) {
        var modais = document.getElementsByClassName('modal');
        for (var i = 0; i < modais.length; i++) {
            if (event.target == modais[i]) {
                modais[i].style.display = "none";
            }
        }
    };

    window.onkeydown = function(event) {
        if (event.key === "Escape") {
            var modais = document.getElementsByClassName('modal');
            for (var i = 0; i < modais.length; i++) {
                modais[i].style.display = "none";
            }
        }
    };
});