#!/bin/bash

curl 'https://calendar.google.com/calendar/ical/07e00c385d4669061a03e7ce2df94817c9b3b59d25fc956991739fe700820280%40group.calendar.google.com/public/basic.ics' 2>/dev/null | grep -v DTSTAMP | tee public/calendar/gsi.ics >/dev/null
curl 'https://calendar.google.com/calendar/ical/c29b66ae0b972444723049fd41751695442b047ff1f3499171fe0d8197637a89%40group.calendar.google.com/public/basic.ics' 2>/dev/null | grep -v DTSTAMP | tee public/calendar/didi.ics >/dev/null
curl 'https://calendar.google.com/calendar/ical/65f7f0888c8e9ed5578b305e910991f2053e48720eee806474804b50b7812bd6%40group.calendar.google.com/public/basic.ics' 2>/dev/null | grep -v DTSTAMP | tee public/calendar/pymk.ics >/dev/null
