# Text and Image processing
## Requirements
```bash
$ pip install -r requirements.txt
```
Create a .env file in the same directory
```bash
API_KEY=your-api-key
PALM_KEY=your-palm-key
```
## translateText.py
To call translate function
```python
from TextAndImageProcessing import translateText.translate_text
target="en" # for hindi, for other languages, use the BCP 47 code
text=""
translateText.translate_text(target,text) # it can detect the language given as input
```

## Extracting text from image
```python
from visionary import detect_handwriting_ocr
from understandText import Text_Feature_Extraction
response=Text_Feature_Extraction(detect_handwriting_ocr("path/to/image"))
# response is a json
```

## Convert image to pdf
```python
from convertpdf2img import convert
convert("path")
```