import json
def translate_text(target: str, text: str) -> str:
    """Translates text into the target language.

    Target must be an ISO 639-1 language code.
    See https://g.co/cloud/translate/v2/translate-reference#supported_languages
    """
    from google.cloud import translate_v2 as translate
    from dotenv import load_dotenv
    import os
    import json
    load_dotenv()

    API_KEY=os.environ.get("API_KEY")
    print(API_KEY)

    translate_client = translate.Client(client_options={"api_key":API_KEY})

    if isinstance(text, bytes):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    result = translate_client.translate(text, target_language=target)
    with open("/home/ubuntu/ApolloXIIT/TextAndImageProcessing/JSON/Translate_output.json","w") as fh:
        json.dump(result,fh)
    return result["translatedText"]
if __name__=="__main__":
    print(json.loads(translate_text(target="en",text="Hello world")))