document.addEventListener('DOMContentLoaded', () => {
    const enlace = document.getElementById('link');
    const polite = document.getElementById('polite');
    const nasty = document.getElementById('nasty');    
    function politeText (){
        enlace.innerHTML = "Click Here";
        document.body.style.backgroundColor = 'lightblue';
    }
    polite.addEventListener('click', politeText);
    nasty.addEventListener('click', () => {
        enlace.textContent = "Here Bitch";
    })
})