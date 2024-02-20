from pdf2image import convert_from_path
def convert(path):
    images= convert_from_path(path)
    i=0
    for img in images:
        i+=1
        img.save(f"output{i}.jpeg","JPEG")