document.addEventListener("DOMContentLoaded", function () {
    // Rola suavemente para o topo após o carregamento completo da página
    window.onload = function () {
        scrollToTop();
    };

    // Função para rolar suavemente para o topo
    function scrollToTop() {
        if ('scrollBehavior' in document.documentElement.style) {
            // Se o navegador suporta scroll suave nativo
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            // Fallback para navegadores sem suporte a scroll suave
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100); // Pequeno delay para garantir que a rolagem ocorra após o carregamento
        }
    }

    const form = document.getElementById("contact-form");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const closeButton = document.createElement("button"); // Botão para fechar o popup

    // Adiciona um botão de fechamento ao popup
    closeButton.textContent = "X";
    closeButton.className = "button is-small is-danger mt-2"; // Estilo Bulma para o botão
    closeButton.style.display = "none"; // Oculta o botão inicialmente
    popup.appendChild(closeButton);

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Exibe o popup de carregamento enquanto o formulário é enviado
            showPopup("Enviando sua mensagem...", "loading");

            // Envia os dados via Fetch API
            fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    Accept: "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        // Envio bem-sucedido
                        showPopup("Mensagem enviada com sucesso!", "success");
                        form.reset(); // Limpa o formulário
                    } else {
                        // Erro no envio
                        showPopup("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.", "error");
                    }
                })
                .catch(() => {
                    // Captura erros de rede
                    showPopup("Erro de conexão. Verifique sua internet e tente novamente.", "error");
                });
        });
    }

    // Função para exibir o popup
    function showPopup(message, type) {
        popupMessage.textContent = message;
        popup.className = "popup"; // Remove classes anteriores
        popup.classList.add(type); // Adiciona a classe correspondente (success, error ou loading)
        popup.style.display = "block"; // Exibe o popup

        // Mostra o botão de fechamento apenas para mensagens de sucesso ou erro
        if (type === "success" || type === "error") {
            closeButton.style.display = "inline-block";
        } else {
            closeButton.style.display = "none";
        }

        // Fecha o popup automaticamente após 5 segundos (apenas para sucesso ou erro)
        if (type === "success" || type === "error") {
            setTimeout(function () {
                popup.style.display = "none";
                closeButton.style.display = "none";
            }, 5000);
        }
    }

    // Fecha o popup quando o botão "Fechar" for clicado
    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
        closeButton.style.display = "none";
    });

    // Navegação suave entre as seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault(); // Impede o comportamento padrão do link

            const targetId = this.getAttribute("href").substring(1); // Remove o "#" do href
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Ajusta a posição para evitar sobreposição do cabeçalho
                    behavior: "smooth" // Ativa a rolagem suave
                });
            }
        });
    });
});