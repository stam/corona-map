# corona-measures

Interactive map to show corona in europe

# Getting started

Update data

```
cd etl
python3 -m venv venv
pip install -r requirements.txt
python main --sync
```

Run frontend

```
cd ../frontend
yarn
yarn start
```
