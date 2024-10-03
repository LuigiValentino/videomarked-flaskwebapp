import os
import io
import tempfile
from flask import Flask, render_template, request, send_file
from moviepy.editor import VideoFileClip

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_video():
    if 'video' not in request.files:
        return 'No se seleccionó ningún archivo', 400

    file = request.files['video']
    if file.filename == '':
        return 'No se seleccionó ningún archivo', 400

    if file:
        try:
            temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            temp_input.write(file.read())
            temp_input.close()

            output_format = request.form['format']

            temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=f".{output_format}")
            temp_output.close()

            if output_format == 'avi':
                codec = 'png'
            elif output_format == 'mkv':
                codec = 'libx264'
            elif output_format == 'mov':
                codec = 'libx264'
            elif output_format == 'wmv':
                codec = 'msmpeg4'
            elif output_format == 'flv':
                codec = 'libx264'
            elif output_format == 'webm':
                codec = 'libvpx'
            elif output_format == 'ogv':
                codec = 'libtheora'
            elif output_format == 'mpeg':
                codec = 'mpeg2video'
            else:
                codec = 'libx264'

            clip = VideoFileClip(temp_input.name)
            clip.write_videofile(temp_output.name, codec=codec)


            return send_file(temp_output.name, as_attachment=True, download_name=f"video_convertido.{output_format}", mimetype=f'video/{output_format}')

        except Exception as e:
            return f'Error al convertir el video: {e}', 500

        finally:
            
            try:
                if os.path.exists(temp_input.name):
                    os.remove(temp_input.name)
                if os.path.exists(temp_output.name):
                    os.remove(temp_output.name)
            except Exception as cleanup_error:
                print(f"Error al eliminar los archivos temporales: {cleanup_error}")


if __name__ == '__main__':
    app.run(debug=True)
