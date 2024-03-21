from TextAndImageProcessing.visionary import detect_handwritten_ocr
from TextAndImageProcessing.understandText import Text_Feature_Extraction
from TextAndImageProcessing.translateText import translate_text
from TextAndImageProcessing.handlingQuery2 import HandleQuery
from icecream import ic
import sys
import os

credential_path = "./private.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

if __name__=="__main__":
    # If image, call IMAGE otherwise, do TRANSLATE, pass the stdout input of QUERY
    if(sys.argv[1]=="IMAGE"):
        print(Text_Feature_Extraction(detect_handwritten_ocr(sys.argv[2]),sys.argv[2]))
    if(sys.argv[1]=="TRANSLATE"):
        print(translate_text("en",sys.argv[2]))
    if(sys.argv[1]=="QUERY"):
        HandleQuery(sys.argv[2])