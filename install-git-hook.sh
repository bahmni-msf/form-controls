#!/bin/bash

# Add pre-push hook

echo "#!/bin/bash

read local_ref local_sha remote_ref remote_sha

if [ \${remote_ref} != 'refs/heads/master' ]
then
    exit 0
fi

git log --pretty=format:\"%s\" | head -n 1 | grep 'Bumped to version .*'

if [ \$? == 0 ]
then
        exit 0
else
        echo -e \"\e[00;31mPlease run 'npm run bump-up' before pushing your changes\e[00m\"
        exit 1
fi
" > .git/hooks/pre-push

chmod +x .git/hooks/pre-push

echo "#!/usr/bin/env ruby
      message_file = ARGV[0]
      message = File.read(message_file)
      \$regex = /(^\s*([\w]+)\s*(?:\,)?\s*([\w]*)\s*\|\s*\#\d+\s*\|.*$|.*Merge branch.*)/

      unless \$regex.match(message)
        puts \"[POLICY] Your message is not formatted correctly\"
        puts \"Expected Format: Pair1, Pair2 | #cardNumber | Message\"
    exit 1
end
" > .git/hooks/commit-msg

chmod +x .git/hooks/commit-msg
