PROJECT_DIR = '/var/www/yakyik'
activate_this = '/var/www/yakyik/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import os, sys
sys.path.insert(0, '/var/www/yakyik')
sys.stdout = sys.stderr
from yakyik import app as application
