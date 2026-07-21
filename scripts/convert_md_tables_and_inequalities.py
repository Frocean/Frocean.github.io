# coding: utf-8
"""
Script to convert markdown pipe-tables to HTML <table> and replace '&lt;=' with inline LaTeX \leqslant
Only operates on the target file; skips fenced code blocks.
"""
import re
import sys

src = r"content/posts/oi/【USACO题库】 动态规划 汇总(普及-至普及).md"
with open(src, 'r', encoding='utf-8') as f:
	lines = f.readlines()

out_lines = []
inside_code = False
i = 0
n = len(lines)

# helper: detect markdown table block starting at index i
def is_table_line(s):
	return s.lstrip().startswith('|')

while i < n:
	line = lines[i]
	# code fence toggle
	if line.startswith('```'):
		inside_code = not inside_code
		out_lines.append(line)
		i += 1
		continue
	if inside_code:
		out_lines.append(line)
		i += 1
		continue
	# table block
	if is_table_line(line):
		# collect consecutive table-like lines
		j = i
		block = []
		while j < n and is_table_line(lines[j]):
			block.append(lines[j].rstrip('\n'))
			j += 1
		# if block has at least 2 lines and second line is a separator like | --- | --- |
		if len(block) >= 2 and re.match(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$", block[1]):
			# parse header row and body rows
			header = block[0]
			body = block[2:]
			# split into cells
			def split_row(r):
				# remove leading/trailing |
				r2 = r.strip()
				if r2.startswith('|'):
					r2 = r2[1:]
				if r2.endswith('|'):
					r2 = r2[:-1]
				parts = [c.strip() for c in r2.split('|')]
				return parts
			headers = split_row(header)
			out_lines.append('<table>\n')
			out_lines.append('<thead>\n')
			out_lines.append('<tr>')
			for h in headers:
				out_lines.append('<th>' + h + '</th>')
			out_lines.append('</tr>\n')
			out_lines.append('</thead>\n')
			if body:
				out_lines.append('<tbody>\n')
				for brow in body:
					cells = split_row(brow)
					out_lines.append('<tr>')
					for c in cells:
						out_lines.append('<td>' + c + '</td>')
					out_lines.append('</tr>\n')
				out_lines.append('</tbody>\n')
			out_lines.append('</table>\n')
			i = j
			continue
		else:
			# not a standard table separator; convert each single line pipe to a simple row table
			# fallback: wrap consecutive pipe lines into simple table without header/body distinction
			out_lines.append('<table>\n')
			out_lines.append('<tbody>\n')
			for brow in block:
				# split and create td
				r = brow.strip()
				if r.startswith('|'):
					r = r[1:]
				if r.endswith('|'):
					r = r[:-1]
				parts = [c.strip() for c in r.split('|')]
				out_lines.append('<tr>')
				for c in parts:
					out_lines.append('<td>' + c + '</td>')
				out_lines.append('</tr>\n')
			out_lines.append('</tbody>\n')
			out_lines.append('</table>\n')
			i = j
			continue
	# non-table, non-code
	# replace HTML entity &lt;= with \leqslant and try to wrap expressions containing it in $...$
	s = line
	if '&lt;=' in s:
		s = s.replace('&lt;=', ' \\leqslant ')
		# wrap contiguous tokens that include \leqslant into $...$
		# find sequences of chars (digits, letters, spaces, parentheses, commas, dots) that include \leqslant
		def wrap_match(m):
			inner = m.group(0)
			# avoid double-wrapping if already inside $
			if '$' in inner:
				return inner
			return '$' + inner.strip() + '$'
		# regex: capture sequences that include at least one \leqslant
		s = re.sub(r'([\dA-Za-z_\s\(\)\.,]+\\\\leqslant[\dA-Za-z_\s\(\)\.,]*(?:\\\\leqslant[\dA-Za-z_\s\(\)\.,]*)*)', wrap_match, s)
	out_lines.append(s)
	i += 1

# write back
with open(src, 'w', encoding='utf-8') as f:
	f.writelines(line if line.endswith('\n') else line + '\n' for line in out_lines)
print('done')
