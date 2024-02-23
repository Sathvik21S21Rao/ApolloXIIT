from TextAndImageProcessing.visionary import detect_handwritten_ocr
from TextAndImageProcessing.understandText import Text_Feature_Extraction
from TextAndImageProcessing.translateText import translate_text
from icecream import ic
import sys

if __name__=="__main__":
    if(sys.argv[1]=="IMAGE"):
        print(Text_Feature_Extraction(detect_handwritten_ocr(sys.argv[2])))
    if(sys.argv[1]=="TRANSLATE"):
        print(translate_text("en",sys.argv[2]))
    if(sys.argv[1]=="QUERY"):
        print()