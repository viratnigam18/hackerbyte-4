import pandas as pd

def load_mental_data(path):
    df = pd.read_csv(path)
    
    # Adjust column names if needed
    df = df[['text', 'status']]
    df.rename(columns={'status': 'label'}, inplace=True)
    
    df.dropna(inplace=True)
    df['text'] = df['text'].str.lower()
    
    return df


def load_suicide_data(path):
    df = pd.read_csv(path)
    
    df = df[['text', 'class']]
    df.dropna(inplace=True)
    
    df['text'] = df['text'].str.lower()
    
    return df