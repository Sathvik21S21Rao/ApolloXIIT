import google.generativeai as palm
import os
from dotenv import load_dotenv
import json
import requests

'''
1. Name of doctor
2. ⁠Name of hospital
3. ⁠Name of drug
4. ⁠Dosage
5. ⁠No of times to take (001 thing)
6. ⁠Date of prescription (very important)
7. ⁠Future consultation (Yes/No)

8. The name . Date of collection of sample/ date of report
10. Total amount or bill: If it is mentioned in the report/ prescription
'''
'''
Common tests:

    1. Complete Blood Count –
            i. Hemoglobin
            ii. RBC count
            iii. Leukocytes
            iv. Platelets
    2. Blood Glucose – 
            i. HbA1c
            ii. Fasting Plasma Glucose
            iii. Random Plasma Glucose (Random Blood Sugar)

    3. Lipid Profile –
            i. Total Cholesterol (serum)
            ii. Triglyceride
            iii. HDL
    4. Liver Function Test - 
            i. AST
            ii. ALT
            iii. ALP
            iv. Total Protein
            v. Total Serum Bilirubin (Direct or Indirect may also be mentioned)
            vi. Albumin
    5. Renal Function Test
            i. Creatinine Clearance
            ii. Serum Creatinine
            iii. Blood Urea Nitrogen
            iv. GFR
    6. Thyroid Function Test
            i. TSH
            ii. T3 or T4
    7. X- ray
    8. CT scan
    9. ECG
    10. 2D – Echo (Echocardiography)
            i. Doppler evaluation
    11. Ultrasound
    12. MRI
    13. Vitamins
        a. D3
        b. B12
    14. Urine analysis
    15. CK-MB and cTN


Department and lab name also can be used
'''

def Text_Feature_Extraction(text:str) -> str:

    load_dotenv()
    API_KEY=os.environ.get("PALM_KEY")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY
    headers = {"Content-Type": "application/json"}
    
    prompt1=f"{text} is this is a lab test? (Yes/No)"
    data = {"contents": [{"parts": [{"text": prompt1}]}]}
    response=requests.post(endpoint,headers=headers,json=data)
    if response.status_code!=200:
        raise Exception("Could not communicate with api")
    print(response.json())
    Type=response.json()["candidates"][0]["content"]["parts"][0]["text"]

    if("No" in Type):
        clinical='''
    1. Name of doctor\n
    2. ⁠Name of hospital\n
    3. ⁠Name of drug(if multiple separate with commas)\n
    4. Amount of each drug:(if given else NULL)\n
    5. Schedule for the dosage. It could be written as 3 binary then Extract the 3 binary digits of dosage. Else state it as it is\n
    6. Number of days for the dosage to be taken (if given else NULL)\n
    7. ⁠Date of prescription (very important)\n
    8. ⁠Future consultation(Yes/No)\n'''
        fields=["Doctor","Hospital","Drugs","Amounts","Schedule","Days","Date","Future consultation"]
        field_format='''{"Doctor": "","Hospital": "","Drugs": [],"Amounts": [],"Schedule": "","Days": "","Date": "","Future consultation": ""}'''
        prompt2=f'''Text:{text}\nThis is a medical report, clean the text and extract the following:\n'''+clinical+f"The output should be with field format:{field_format}."
        data=data = {"contents": [{"parts": [{"text": prompt2}]}]}
        response=requests.post(endpoint,headers=headers,json=data)
        if response.status_code!=200:
                raise Exception("Could not communicate with api")
        
        result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
        result["Type"]="Prescription"
        with open("./TextAndImageProcessing/JSON/output.json","w") as fh:
                json.dump({"response":result},fh)
        
    elif("yes" in Type.lower()):
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
      d={"Doctor Name":"","Hospital Name":"","Date":"","Categories":[]}
      
      prompt2=f"Text:{text}\nCategories:{categories}. Return the Doctor Name,Hospital Name,Date and the categories which the report specifies.Return it in this format {d}"
      data = {"contents": [{"parts": [{"text": prompt2}]}]}
      response=requests.post(endpoint,headers=headers,json=data)
      if response.status_code!=200:
        raise Exception("Could not communicate with api")
      result=response.json()["candidates"][0]["content"]["parts"][0]["text"]
      result["Type"]="Lab"
      with open("./TextAndImageProcessing/JSON/output.json","w") as fh:
          json.dump({"response":result},fh)
        
if __name__=="__main__":
    print(Text_Feature_Extraction(open("output").read()))
    
