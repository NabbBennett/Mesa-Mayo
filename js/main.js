document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-item');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const container = document.querySelector('.container');
    
    images.forEach(image => {
        image.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
    
            if (isCorrect) {
                // Imagen correcta
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';

                // Añadir efecto visual de éxito
                this.style.boxShadow = '0 0 20px #4caf50';
                this.style.border = '3px solid #4caf50';

                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = 'paginas/index.html'; 
                }, 1500);
            } else {
                // Imagen incorrecta
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';

                container.classList.add('shake');
                this.style.boxShadow = '0 0 20px #ff5252';
                this.style.border = '3px solid #ff5252';

                setTimeout(() => {
                    container.classList.remove('shake');
                    this.style.boxShadow = '';
                    this.style.border = '';
                }, 500);
            }
        });
    });
});
