# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

from datetime import date
import os

project = 'ITK-Wasm'
copyright = f'{date.today().year}, NumFOCUS'
author = 'Matt McCormick'

# Define the canonical URL if you are using a custom domain on Read the Docs
html_baseurl = os.environ.get("READTHEDOCS_CANONICAL_URL", "wasm.itk.org")

html_context = {}
# Tell Jinja2 templates the build is running on Read the Docs
if os.environ.get("READTHEDOCS", "") == "True":
    html_context["READTHEDOCS"] = True

extensions = [
    'sphinx.ext.napoleon',
    'autodoc2',
    'myst_parser',
    'sphinx.ext.intersphinx',
    'sphinx_copybutton',
    'sphinxext.opengraph',
    'sphinx_design',
]

myst_enable_extensions = ["colon_fence", "fieldlist"]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

autodoc2_packages = [
    {
        "path": "../packages/core/python/itkwasm/itkwasm",
        "exclude_files": ["_to_numpy_array.py",],
    },
]
autodoc2_render_plugin = "myst"

intersphinx_mapping = {
    "python": ("https://docs.python.org/3/", None),
    "numpy": ("https://numpy.org/doc/stable", None),
}

html_theme = 'furo'
html_static_path = ['_static']
html_logo = "_static/logo-white.svg"
html_favicon = "_static/icon/favicon.png"
html_title = f"{project} documentation"
html_baseurl = os.environ.get("SPHINX_BASE_URL", "")

# Furo options
html_theme_options = {
    "top_of_page_button": "edit",
    "source_repository": "https://github.com/InsightSoftwareConsortium/ITK-Wasm/",
    "source_branch": "main",
    "source_directory": "docs",
}
