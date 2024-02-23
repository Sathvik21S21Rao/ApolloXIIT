# from TextAndImageProcessing.convertpdf2img import convert

def detect_handwritten_ocr(url):
    """Detects handwritten characters in a local image.

    Args:
    path: The path to the local file.
    """
    from google.cloud import vision_v1p3beta1 as vision
    from dotenv import load_dotenv
    import os 
    import requests
    load_dotenv()
    API_KEY=os.environ.get("API_KEY")
    
    client = vision.ImageAnnotatorClient(client_options={"api_key":API_KEY})
    content=requests.get(url).content
    # with open(path, "rb") as image_file:
    #     content = image_file.read()

    image = vision.Image(content=content)

    # Language hint codes for handwritten OCR:
    # en-t-i0-handwrit, mul-Latn-t-i0-handwrit
    # Note: Use only one language hint code per request for handwritten OCR.
    image_context = vision.ImageContext(language_hints=["en-t-i0-handwrit"])
    vision.AnnotateImageRequest()
    response = client.document_text_detection(image=image, image_context=image_context)
    

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    return response.full_text_annotation.text

if __name__=="__main__":
    # convert("./Test/test3.pdf")
    print(detect_handwritten_ocr(  "https://AC0a596f880a429fa354df2f18ccc60c22:790227ccd7897b25ee4848cb2483b276@api.twilio.com/2010-04-01/Accounts/AC0a596f880a429fa354df2f18ccc60c22/Messages/MM779d253a1157755d271e231376676d7b/Media/ME80353c34701b29123a50f5dfc721dd7c") 
)