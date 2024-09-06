import yaml

with open('manifest.yml') as f:
    doc = yaml.safe_load(f)
del doc['modules']['jira:projectPage'][0]['displayConditions']

with open('manifest.yml', 'w+') as f:
    yaml.dump(doc, f)