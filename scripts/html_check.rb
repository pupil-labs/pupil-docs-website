require 'html-proofer'
require_relative 'custom_img_check'

options = { 
	:check_html => true, 
	:checks_to_ignore => ["ImageCheck"],
	:parallel => { :in_processes => 3},
	:file_ignore => [/.\/public.[^master].+/],
	:typhoeus => {
		# avoid strange SSL errors: https://github.com/gjtorikian/html-proofer/issues/376
		:connecttimeout => 20,
		:timeout => 60,
		:ssl_verifypeer => false,
		:ssl_verifyhost => 0,
		:verbose => false
	}
}

begin
	HTMLProofer.check_directory('./public',options).run
rescue RuntimeError => e
	puts e
end
