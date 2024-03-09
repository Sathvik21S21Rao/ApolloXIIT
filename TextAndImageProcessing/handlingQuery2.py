import requests,json,os
from dotenv import load_dotenv
from vertexai.preview.generative_models import GenerativeModel

def HandleQuery(query:str):
    load_dotenv()
    PALM_KEY=os.environ.get('PALM_KEY')
    gemini_pro_model = GenerativeModel("gemini-1.0-pro")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + PALM_KEY
    headers = {"Content-Type": "application/json"}
    prompt=f'''"Query:{query}\nIs the query related to medical lab report?. Output : Yes or No'''
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response=gemini_pro_model.generate_content(prompt,safety_settings=None).to_dict()
   
    try:
        result=response["candidates"][0]["content"]["parts"][0]["text"]
        print(result)
        if "Yes" in result:
            categories='''"14. Complete Blood Count\n \
                15. Blood Glucose\n \
                16. Lipid Profile\n \
                17. Liver Function Test\n \
                18. Renal Function Test\n \
                19. Thyroid Function Test \
                20. X-ray\n \
                21. CT Scan\n \
                22. ECG\n \
                23. 2D – Echo (Echocardiography)\n\
                24. Ultrasound\n\
                25. MRI\n\
                26. Vitamins\n\
                27. Urine Analysis\n\
                28. sCK-MB and cTN\n'''
            
            templates=f'''Query:{query}.Classify the query based on the given categories\nCategories:\n12. Give details about the last lab test\n
            {categories} Output: Return the list of indices of the categories, which are relevant for the given query.\n'''

            response=gemini_pro_model.generate_content(templates,safety_settings=None).to_dict()
            result=response["candidates"][0]["content"]["parts"][0]["text"]
            
            with open("./TextAndImageProcessing/JSON/output.json","w") as fh:
                if result[0]!="[":
                    result=[int(result)]
                else:
                    result=eval(result)
                    result=[int(i) for i in result]
                json.dump({0:"Lab",1:"FIND MANY",2:result},fh)
        else:
            
            templates='''
            1. Give details about the last doctor appointment\m
            2. What are the next appointment?\n
            3. Which medicines should I take?\n
            4. Send the latest prescription\n
            5. Give details about the appointments with doctor_name\n
            6. Give all appointments from xyz hospital\n
            7. Send prescription from xyz hospital\n
            8. Send prescription from xyz doctor\n
            9. Send prescription from some date\n
            10. Hello, how are you?\n
            11. Thank you\n'''

            prompt=f"Query:{query}\nClassify the query based on the given templates\nTemplates:{templates}\n.Output: Return the list of indices of the templates, which are similar to the given query.\n"
            response=gemini_pro_model.generate_content(prompt,safety_settings=None).to_dict()
            result=response["candidates"][0]["content"]["parts"][0]["text"]
            
            with open("./TextAndImageProcessing/JSON/output.json","w") as fh:
                if result[0]!="[":
                    result=[int(result)]
                else:
                    result=eval(result)
                    result=[int(i) for i in result]
                json.dump({0:"Prescription",1:"FIND MANY",2:result},fh)

    
    except Exception as e:
        print(e)
        return None
if __name__=="__main__":
    print(HandleQuery("Which medicines should i take?"))
    

