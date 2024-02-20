from TextAndImageProcessing.visionary import detect_handwritten_ocr
from TextAndImageProcessing.understandText import Text_Feature_Extraction
from icecream import ic
import sys

if __name__=="__main__":
    # ic(detect_handwritten_ocr(sys.argv[1]))
    ic(Text_Feature_Extraction(detect_handwritten_ocr(sys.argv[1])))