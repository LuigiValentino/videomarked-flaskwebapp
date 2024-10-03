    const form = document.getElementById('uploadForm');
    const progressBarUpload = document.getElementById('progressBarUpload');
    const progressTextUpload = document.getElementById('progressTextUpload');
    const progressContainerUpload = document.getElementById('progressContainerUpload');
    const progressBarConversion = document.getElementById('progressBarConversion');
    const progressTextConversion = document.getElementById('progressTextConversion');
    const progressContainerConversion = document.getElementById('progressContainerConversion');
    const successMessage = document.getElementById('successMessage');
            
        form.addEventListener('submit', function(event) {
        event.preventDefault();
        progressContainerUpload.classList.remove('hidden');
        progressContainerConversion.classList.add('hidden');
        successMessage.classList.add('hidden');
        progressBarUpload.value = 0;
        progressTextUpload.textContent = '0%';
                
        
        const formData = new FormData(form);
        const selectedFormat = document.getElementById('format').value;  io
        const xhr = new XMLHttpRequest();
        
                xhr.open('POST', '/convert', true);
                xhr.responseType = 'blob'; 
                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        progressBarUpload.value = percentComplete;
                        progressTextUpload.textContent = Math.round(percentComplete) + '%';
                    }
                };

                xhr.onloadstart = function() {
                    progressContainerConversion.classList.remove('hidden');
                    progressTextConversion.textContent = 'Convirtiendo archivo...';
                };

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: xhr.response.type });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `video_convertido.${selectedFormat}`;  
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        successMessage.classList.remove('hidden');
                        progressContainerConversion.classList.add('hidden');
                    }
                };
                xhr.send(formData);
            });