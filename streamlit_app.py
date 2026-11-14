from pathlib import Path

import streamlit as st
from streamlit.components.v1 import declare_component

st.set_page_config(
    page_title="مسطرة · Mastara",
    page_icon=":material/straighten:",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Streamlit-Rahmen entfernen, damit die Seite bündig und ohne Farbkante im Browser sitzt.
st.html(
    """<style>
    header[data-testid="stHeader"], [data-testid="stToolbar"], [data-testid="stDecoration"], footer { display: none; }
    .stApp { background: #f2f4f5; }
    [data-testid="stMainBlockContainer"], .block-container { padding: 0 !important; max-width: 100% !important; }
    [data-testid="stVerticalBlock"] { gap: 0; }
    iframe { border: 0; display: block; }
    </style>"""
)

site = declare_component("mastara", path=Path(__file__).resolve().parent / "dist")
site(key="mastara_site")
