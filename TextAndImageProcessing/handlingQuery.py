import requests,json,os
from dotenv import load_dotenv
from subcategoriesClassification import classify
def HandleQuery(query:str):
    load_dotenv()
    PALM_KEY=os.environ.get('API_KEY')
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + PALM_KEY
    headers = {"Content-Type": "application/json"}
    prompt=f'''"Query:{query}\nIs the query related to medical lab report?. Output is Yes or No'''
        
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response=requests.post(endpoint,headers=headers,json=data)
    if response.status_code!=200:
        raise Exception("Could not communicate with api")
   
    try:
        result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
        if "Yes" in result:
            categories='''13a. Complete Blood Count\n \
                13b. Blood Glucose\n \
                13c. Lipid Profile\n \
                13d. Liver Function Test\n \
                13e. Renal Function Test\n \
                13f. Thyroid Function Test \
                13g. X-ray\n \
                13h. CT Scan\n \
                13i. ECG\n \
                13j. 2D – Echo (Echocardiography)\n\
                13k. Ultrasound\n\
                13l. MRI\n\
                13m. Vitamins\n\
                13n. Urine Analysis\n\
                13o. sCK-MB and cTN\n'''
            templates='''12. Give details about the last lab test
            13. Classify based on report type
            '''
            prompt=f"Templates:{templates}\n. Output: Return the indices of the templates which are the most similar to the query:{query}."
            data = {"contents": [{"parts": [{"text": prompt}]}]}
            response=requests.post(endpoint,headers=headers,json=data)
            result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
            if('13' in result):
                result=classify(query,categories)
            with open("./TextAndImageProcessing/JSON/output.json","wb") as fh:
                print(result)
                json.dump(["Lab","FIND MANY",result],fh)
        else:
            
            templates='''
            1. Give details about the last doctor appointment
            2. What are the next appointment?
            3. Which medicines should I take?
            4. Send the latest prescription
            5. Give details about the appointments with doctor_name
            6. Give all appointments from xyz hospital
            7. Send prescription from xyz hospital
            8. Send prescription from xyz doctor
            9. Send prescription from some date
            10. Hello, how are you?
            11. Thank you'''

            prompt=f"Templates:{templates}\n. Output: Return the indices of the templates which are the most similar to the query:{query}."
            
            data = {"contents": [{"parts": [{"text": prompt}]}]}
            response=requests.post(endpoint,headers=headers,json=data)
            
            with open("./TextAndImageProcessing/JSON/output.json","wb") as fh:
                json.dump(["Prescription","FIND MANY",response.json()["candidates"][0]["content"]["parts"][0]["text"]],fh)
    
    except Exception as e:
        print(e)
        return None
if __name__=="__main__":
    print(HandleQuery("Give me my blood report"))
    

