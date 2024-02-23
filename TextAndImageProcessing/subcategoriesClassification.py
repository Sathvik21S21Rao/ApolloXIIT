import requests,json,os
from dotenv import load_dotenv
def classify(text:str,categories):
    load_dotenv()
    API_KEY=os.environ.get("PALM_KEY")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY
    headers = {"Content-Type": "application/json"}
    prompt1=f"Text:{text}\n.Categories:{categories}\n Which categories does the text come under(There can be multiple categories which it can fall under)?"
    data = {"contents": [{"parts": [{"text": prompt1}]}]}
    response=requests.post(endpoint,headers=headers,json=data)
    if response.status_code!=200:
        raise Exception("Could not communicate with api")
    result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
    return result
if __name__=="__main__":
   print( classify("What is my vitamin level?",categories='''Complete Blood Count\n \
                Blood Glucose\n \
                Lipid Profile\n \
                Liver Function Test\n \
                Renal Function Test\n \
                Thyroid Function Test \
                X-ray\n \
                CT Scan\n \
                ECG\n \
                2D – Echo (Echocardiography)\n\
                Ultrasound\n\
                MRI\n\
                Vitamins\n\
                Urine Analysis\n\
                CK-MB and cTN\n'''))


