import requests,json,os
from dotenv import load_dotenv
from vertexai.preview.generative_models import GenerativeModel

def HandleQuery(query:str):
    load_dotenv()
    PALM_KEY=os.environ.get('PALM_KEY')
    gemini_pro_model = GenerativeModel("gemini-1.0-pro")
    # endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + PALM_KEY
    headers = {"Content-Type": "application/json"}
    prompt=f'''"Query:{query}\nIs the query related to medical lab report?. Output : Yes or No'''
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response=gemini_pro_model.generate_content(prompt,safety_settings=None).to_dict()
   
    try:
        result=response["candidates"][0]["content"]["parts"][0]["text"]
        print(result)
        if "Yes" in result:
            # 13 -> 
            categories='''"13. Complete Blood Count\n \
                14. Blood Glucose\n \
                15. Lipid Profile\n \
                16. Liver Function Test\n \
                17. Renal Function Test\n \
                18. Thyroid Function Test \
                19. X-ray\n \
                20. CT Scan\n \
                21. ECG\n \
                22. 2D – Echo (Echocardiography)\n\
                23. Ultrasound\n\
                24. MRI\n\
                25. Vitamins\n\
                26. Urine Analysis\n\
                27. sCK-MB and cTN\n'''
            
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
            # 1 -> Latest date in prescriptions
            # 2 -> If bool thing is true
            # 3 -> drugs array
            # 4 -> same as 1
            # 5 -> prescriptions array with specific doc_name
            # 6 -> prescriptions array with specific hospital with futureConsultation is true
            # 7 -> 
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

            prompt=f"Query:{query}\nClassify the query based on the given templates\nTemplates:{templates}\n.Output: Return the index, which is the most similar to the given query.\n"

            response=gemini_pro_model.generate_content(prompt,safety_settings=None).to_dict()
            result=response["candidates"][0]["content"]["parts"][0]["text"]

            prompt=f"Query:{query}. Extract doctor name or hospital name from query. Strictly return only name."
            print(prompt)
            response=gemini_pro_model.generate_content(prompt,safety_settings=None).to_dict()
            feature=response["candidates"][0]["content"]["parts"][0]["text"]

            with open("./TextAndImageProcessing/JSON/output.json","w") as fh:
                if result[0]!="[":
                    result=[int(result)]
                else:
                    result=eval(result)
                    result=[int(i) for i in result]
                json.dump({0:"Prescription",1:"FIND MANY",2:result,3:feature},fh)# omit feature for unnecessary indices

    
    except Exception as e:
        print(e)
        return None
if __name__=="__main__":
    print(HandleQuery("Which medicines should i take?"))
    

