# Backend

### 1. Install Python

```
https://www.python.org/downloads/
```

### 2. Create a virtual environment

```
pip install virtualenv
python -m venv venv
```

### 3. Activate the virtual environment

```
venv\Scripts\activate (Windows)
source venv/bin/activate (Linux/Mac)
```

### 4. Install dependencies

```
pip install -r requirements.txt
```

### 5. Run the main.py file using uvicorn

```
uvicorn main:app --reload
```
