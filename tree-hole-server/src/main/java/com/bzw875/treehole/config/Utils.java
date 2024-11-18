package com.bzw875.treehole.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {
    private Utils() {
    }

    public static Date getPostTime(String str) {
        String regex = "(\\d+)(分钟|小时|天|周)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);
        if (!matcher.find()) {
            throw new RuntimeException("Invalid input string");
        }
        String number = matcher.group(1);
        String unit = matcher.group(2);

        Map < String, Integer > chTimes = new HashMap < > ();
        Integer minute = 1000*60;
        chTimes.put("分钟", minute);
        chTimes.put("小时", minute*60);
        chTimes.put("天",   minute*60*24);
        chTimes.put("周",   minute*60*24*7);

        return new Date(System.currentTimeMillis() - (chTimes.get(unit) * Integer.parseInt(number)));
    }

    public static Integer getIntFromString(String input) {
        String regex = "(\\d+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            String numberStr = matcher.group(1);
            int number = Integer.parseInt(numberStr);
            return number;
        } else {
            return 0;
        }
    }
}
