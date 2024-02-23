import requests,json,os
from dotenv import load_dotenv
from subcategoriesClassification import classify
def HandleQuery(query:str):
    load_dotenv()
    PALM_KEY=os.environ.get('PALM_KEY')
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + PALM_KEY
    headers = {"Content-Type": "application/json"}
    prompt=f'''"Query:{query}\nIs the query related to medical lab report?. Output is Yes or No'''
        
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response=requests.post(endpoint,headers=headers,json=data)
    if response.status_code!=200:
        raise Exception("Could not communicate with api")
    print("Entered")
    try:
        result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
        if "Yes" in result:
            categories='''Complete Blood Count\n \
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
                CK-MB and cTN\n'''
            return "SEARCH LAB "+classify(query,categories)
        else:
            print("hehe")
            prompt=f"Query:{query}\nIs the query a medical related? Output Yes or No"
            data = {"contents": [{"parts": [{"text": prompt}]}]}
            result=None
            while(result==None):
            
                response=requests.post(endpoint,headers=headers,json=data)
                try:
                    result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
                except:
                    result=None
            print(result)
            if 'no' in result.lower():
                
                if("hello" in query.lower() or "hi" in query.lower()):

                    return '''Hello ,what can I do for you today? (◕‿◕✿)
                    🧾Store your prescriptions and medical reports or alter your information? 📖
                    👩‍⚕️ Do you want to book an appointment? 🏥
                    💊 Medication reminder settings⏱️'''
                elif("thank" in query.lower()):
                    return "Happy to help! (๑´•.̫ • `๑)"
            else:
               pass
                

    except Exception as e:
        return None
if __name__=="__main__":
    print("OUT",HandleQuery("medicines to be taken"))
    
'''
1.Give details about my last doctor appointment?
2.When is my next appointment?
3.Which medicines should i take?
4.Send my latest prescription?
5.Give details about my appointments with doctor_name
6.Give all appointments at hospital_name
7.My appointment on DATE
8.Hello , how are you?
9.Thank you

'''
