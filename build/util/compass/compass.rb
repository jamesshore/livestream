PROJECT_ROOT_DIR = "."
COMPASS_DIR = "#{PROJECT_ROOT_DIR}/build/util/compass";
GEM_CACHE_DIR = "#{PROJECT_ROOT_DIR}/gem_cache"
ISOLATE_DIR = "#{COMPASS_DIR}/vendor/isolate-3.2.4";

CONFIG_FILE = "#{COMPASS_DIR}/compass_config.rb"

STDOUT.sync = true

def install_compass
	puts("Isolating Compass gem... ")

	$:.unshift "#{ISOLATE_DIR}/lib"
	require 'isolate'
	Isolate.now! :system => false, :path => GEM_CACHE_DIR, :install => true do
		gem "compass", "1.0.1"
	end
end

def run_compass()
	command = "compass compile src/lets_code_javascript/client src/lets_code_javascript/client/sass/screen.scss --config #{CONFIG_FILE}"
	puts "▻ " + command
	system command
end

install_compass
run_compass
