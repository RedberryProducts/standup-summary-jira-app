import yaml

with open('manifest.yml') as f:
    doc = yaml.safe_load(f)
doc['modules']['jira:projectPage'][0]['displayConditions'] = None

with open('manifest.yml', 'w+') as f:
    yaml.dump(doc, f)