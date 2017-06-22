require 'html-proofer'
require_relative 'custom_img_check'

options = { :check_html => true, :checks_to_ignore => ["ImageCheck"], :file_ignore => [/.\/public.[^master].+/] }

begin
	HTMLProofer.check_directory('./public',options).run
rescue RuntimeError => e
	puts e
end
