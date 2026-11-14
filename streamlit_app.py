from pathlib import Path

import streamlit as st
from streamlit.components.v1 import declare_component

st.set_page_config(page_title="مسطرة · Mastara", layout="wide")
site = declare_component("mastara", path=Path(__file__).resolve().parent / "dist")
site(key="mastara_site")
