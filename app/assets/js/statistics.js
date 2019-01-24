module.exports = {
  getLastSmokeTime,
  updateStatistics,
  getTodayChartData,
  getMonthChartData,
  getTotalChartData,
  getXpForLevel
};

function getLastSmokeTime(lastSmokeTime) {

  return new Promise( (resolve, reject) => {

    statisticsDB.find({}).sort({ _id: -1 }).limit(1).exec(function (err, docs) {
      
      docs.forEach(function(doc) {
        year = doc._year;
        month = doc._month;
        day = doc._day;
        hour = doc._hour;
        minute = doc._minute;
        second = doc._seconds;
        
        let lastSmokeDateTime = new Date(year + '-' + month  + '-' + day  + ' ' + hour  + ':' + minute  + ':' + second).getTime();
        resolve(lastSmokeDateTime);
        
      });

      if (lastSmokeTime === 0) {
        lastSmokeTime = Date.now();
        resolve(lastSmokeTime);
      }
      
    });

  });

}

function updateStatistics(dose, breaktime) {

  statisticsDB.find({}).sort({ _id: -1 }).limit(1).exec(function (err, docs) {

    let newid = 0;
    let storedtotal = 0;
    let newtotal = 0;

    docs.forEach(function(doc) {
      newid = doc._id + 1;
      if (doc._cigarettes_total !== undefined && doc._cigarettes_total !== null) {
        storedtotal = doc._cigarettes_total;
      }
    });

    if (newid === 0) {
      newid = 1;
    }

    switch(dose) {
      case "complete":
        newtotal = storedtotal + 1;
        break;
      case "threequarter":
        newtotal = storedtotal + 0.75;
        break;
      case "half":
        newtotal = storedtotal + 0.5;
        break;
      case "quarter":
        newtotal = storedtotal + 0.25;
        break;
      default:
        newtotal = storedtotal + 1;
        break;
    }

    let dateTimeArr = getDateTime();

    let newStatArr = [];

    let newStatObj = {
      _id: newid,
      _year: dateTimeArr[0],
      _month: dateTimeArr[1],
      _day: dateTimeArr[2],
      _hour: dateTimeArr[3],
      _minute: dateTimeArr[4],
      _seconds: dateTimeArr[5],
      _cigarette_strongly: store.get('settings.cigarette-strongly'),
      _cigarette_dose: dose,
      _target_breaktime: store.get('settings.cigarette-breaktime'),
      _performed_breaktime: breaktime,
      _cigarettes_total: newtotal
    };

    newStatArr.push(newStatObj);

    statisticsDB.insert(newStatArr, function(err, docs) {

      re_startBreaktimeCounter();

      let new_xp = calculateXP(store.get('settings.cigarette-strongly'), dose, breaktime);
      levelUp(new_xp);

      re_createTodayChart();
      re_createMonthChart();
      re_createTotalChart();

      getStatistics();
      
    });

  });
}


function getTodayChartData() {

  return new Promise( (resolve, reject) => {

    let todayBreakTimesArr = [];
    let dateTimeArr = getDateTime();

    statisticsDB.find({_year: dateTimeArr[0], _month: dateTimeArr[1], _day: dateTimeArr[2]}).sort({ _id: 1 }).exec(function (err, docs) {
      docs.forEach(function(doc) {
        
        let breakTimeArr = doc._performed_breaktime.split(':');
        let breakTimeInMinutes = (parseInt(breakTimeArr[0]) * 60) + parseInt(breakTimeArr[1]);
        todayBreakTimesArr.push(breakTimeInMinutes);
        
      });
      resolve(todayBreakTimesArr);
    });
  });

}

function getMonthChartData() {

  return new Promise( (resolve, reject) => {

    let dayTMP = 0;
    let zeroDay = true;
    let cigarettePerDay = 0;

    let monthDaysArr = [];
    let cigarettePerDayArr = [];

    let dateTimeArr = getDateTime();

    statisticsDB.find({_year: dateTimeArr[0], _month: dateTimeArr[1]}).sort({ _id: 1 }).exec(function (err, docs) {
      docs.forEach(function(doc) {
        
        day = doc._day;

        if (day !== dayTMP) {

          if (day.toString().length === 1) {
            monthDaysArr.push('0' + day);
          } else {
            monthDaysArr.push(day);
          }
          
          dayTMP = day;
          if (!zeroDay) {
            cigarettePerDayArr.push(cigarettePerDay);
            cigarettePerDay = 0;
          } else {
            zeroDay = false;
          }

        }

        cigarettePerDay++;
      });
      cigarettePerDayArr.push(cigarettePerDay);
      let monthChartDataObj = {monthData: monthDaysArr, cigaretteData: cigarettePerDayArr}
      resolve(monthChartDataObj);
    });
  });

}
getMonthChartData();

function getTotalChartData() {

  return new Promise( (resolve, reject) => {

    let perMonthDateTMP = '';
    let zeroMonth = true;
    let cigarettePerMonth = 0;

    let monthDatesArr = [];
    let cigarettePerMonthArr = [];

    statisticsDB.find({}).sort({ _id: 1 }).exec(function (err, docs) {
      docs.forEach(function(doc) {
        
        year = doc._year;
        month = doc._month;

        if (month.toString().length === 1) {
          month = ('0' + month).slice(-2)
        }

        let perMonthDate = year + '-' + month;
        
        if (perMonthDate !== perMonthDateTMP) {
          monthDatesArr.push(perMonthDate);
          perMonthDateTMP = perMonthDate;
          if (!zeroMonth) {
            cigarettePerMonthArr.push(cigarettePerMonth);
            cigarettePerMonth = 0;
          } else {
            zeroMonth = false;
          }
        }

        cigarettePerMonth++;

      });
      cigarettePerMonthArr.push(cigarettePerMonth);

      let totalDatesChartDataObj = {monthDateData: monthDatesArr, cigaretteData: cigarettePerMonthArr}
      resolve(totalDatesChartDataObj);
    });
  });

}
getTotalChartData();


function getStatistics() {
  
  let dateTimeArr = getDateTime();

  statisticsDB.find({_year: dateTimeArr[0], _month: dateTimeArr[1], _day: dateTimeArr[2]}).exec(function (err, docs) {
    
    let todayCount = 0;
    
    docs.forEach(function(doc) {

      switch(doc._cigarette_dose) {
        case "complete":
          todayCount += 1;
          break;
        case "threequarter":
          todayCount += 0.75;
          break;
        case "half":
          todayCount += 0.5;
          break;
        case "quarter":
          todayCount += 0.25;
          break;
        default:
          todayCount += 1;
          break;
      }

    });
    statsToday.innerHTML = todayCount;

    statsTodayIcon.classList.remove('fa-thumbs-up', 'fa-hand-o-up', 'fa-hand-paper-o', 'fa-thumbs-down');
    if (todayCount <= 6) {
      statsTodayIcon.style.color = "green";
      statsTodayIcon.classList.add('fa-thumbs-up');
    } else if (todayCount > 6 && todayCount <= 10) {
      statsTodayIcon.style.color = "yellow";
      statsTodayIcon.classList.add('fa-hand-o-up');
    } else if (todayCount > 10 && todayCount < 16) {
      statsTodayIcon.style.color = "orange";
      statsTodayIcon.classList.add('fa-hand-paper-o');
    } else {
      statsTodayIcon.style.color = "red";
      statsTodayIcon.classList.add('fa-thumbs-down');
    }

  });

  statisticsDB.find({_year: dateTimeArr[0], _month: dateTimeArr[1]}).exec(function (err, docs) {
    
    let monthCount = 0;
    
    docs.forEach(function(doc) {

      switch(doc._cigarette_dose) {
        case "complete":
          monthCount += 1;
          break;
        case "threequarter":
          monthCount += 0.75;
          break;
        case "half":
          monthCount += 0.5;
          break;
        case "quarter":
          monthCount += 0.25;
          break;
        default:
          monthCount += 1;
          break;
      }

    });
    statsMonth.innerHTML = monthCount;

  });

  statisticsDB.find({}).exec(function (err, docs) {

    let totalCount = 0;

    docs.forEach(function(doc) {

      switch(doc._cigarette_dose) {
        case "complete":
          totalCount += 1;
          break;
        case "threequarter":
          totalCount += 0.75;
          break;
        case "half":
          totalCount += 0.5;
          break;
        case "quarter":
          totalCount += 0.25;
          break;
        default:
          totalCount += 1;
          break;
      }

    });
    statsTotal.innerHTML = totalCount;

  });

}
getStatistics();

/* profile */

function calculateXP(cigarettetype, cigarettedose, breaktime) {

  let xp = 0;
  let xp_breaktime_bonus = 0;

  switch(cigarettetype) {
    case"strong":
      switch(cigarettedose) {
        case"complete":
          xp = 5;
          break;
        case"threequarter":
          xp = 10;
          break;
        case"half":
          xp = 15;
          break;
        case"quarter":
          xp = 20;
          break;
      }
      break;
    case"normal":
      switch(cigarettedose) {
        case"complete":
          xp = 25;
          break;
        case"threequarter":
          xp = 30;
          break;
        case"half":
          xp = 35;
          break;
        case"quarter":
          xp = 40;
          break;
      }
      break;
    case"light":
      switch(cigarettedose) {
        case"complete":
          xp = 45;
          break;
        case"threequarter":
          xp = 50;
          break;
        case"half":
          xp = 55;
          break;
        case"quarter":
          xp = 60;
          break;
      }
      break;
    case"extralight":
      switch(cigarettedose) {
        case"complete":
          xp = 70;
          break;
        case"threequarter":
          xp = 80;
          break;
        case"half":
          xp = 90;
          break;
        case"quarter":
          xp = 100;
          break;
      }
      break;
  }

  /*
  You get 2 points for every minute from your setted breaktime, if you reach it.
  If you don't reach you get 0 point of this bonus.
  */
  let currentTargetBreakTime = store.get('settings.cigarette-breaktime');

  let breaktimeparts = breaktime.split(':');
  let breaktimepartsMinutesFromHours = parseInt(breaktimeparts[0]) * 60;
  let breaktimeMinutes = breaktimepartsMinutesFromHours + parseInt(breaktimeparts[1]);

  if (breaktimeMinutes >= currentTargetBreakTime) {

    xp_breaktime_bonus = breaktimeMinutes * 2;
    
    /*
    If you smoke after you earn the target time, you get 1 point for every minute.
    */
    for (i = currentTargetBreakTime; i < breaktimeMinutes; i++) {
      xp_breaktime_bonus++;
    }
    
  } else {

    /*
    If you smoke before you earn the target time, you lose 1 point for every minute.
    */
    for (i = breaktimeMinutes; i < currentTargetBreakTime; i++) {
      xp--;
    }
    
  }

  xp += xp_breaktime_bonus;
  
  return xp;
}

function levelUp(new_xp) {

  let levelUpped = false;
  let newxp = 0;

  let currentLevel = store.get('profile.level');
  let nextLevel = currentLevel + 1;
  
  if (currentLevel === 50) {
    store.set('profile.level', 50);
    store.set('profile.xp', 0);
  } else {

    currXP = store.get('profile.xp');
    gottedXP = currXP + new_xp;
    
    getXpForLevel(nextLevel)
    .then( (xpForNextLevel) => {

      if (gottedXP >= xpForNextLevel) {
        if (gottedXP === xpForNextLevel) {
          store.set('profile.level', nextLevel);
          store.set('profile.xp', 0);
        } else {
          store.set('profile.level', nextLevel);
          newxp = gottedXP - xpForNextLevel;
          store.set('profile.xp', newxp);
        }

        setTimeout( () => {
          levelUp(0);
        }, 1500);
        
        levelUpped = true;
  
      } else {
        store.set('profile.xp', gottedXP);
      }
      
      if (levelUpped) {
        showModal('levelUpModal');
      }
      
      re_fillProfileData();
  
    });

  }

}

function getXpForLevel(level) {

  return new Promise( (resolve, reject) => {

    let xp_need = 0;

    switch (level) {
      case 1:
        xp_need = 0;
        break;
      case 2:
        xp_need = 100;
        break;
      case 3:
        xp_need = 300;
        break;
      case 4:
        xp_need = 500;
        break;
      case 5:
        xp_need = 700;
        break;
      case 6:
        xp_need = 900;
        break;
      case 7:
        xp_need = 1200;
        break;
      case 8:
        xp_need = 1500;
        break;
      case 9:
        xp_need = 1800;
        break;
      case 10:
        xp_need = 2100;
        break;
      case 11:
        xp_need = 2400;
        break;
      case 12:
        xp_need = 2700;
        break;
      case 13:
        xp_need = 3000;
        break;
      case 14:
        xp_need = 3300;
        break;
      case 15:
        xp_need = 3600;
        break;
      case 16:
        xp_need = 3900;
        break;
      case 17:
        xp_need = 4200;
        break;
      case 18:
        xp_need = 4500;
        break;
      case 19:
        xp_need = 4800;
        break;
      case 20:
        xp_need = 5200;
        break;
      case 21:
        xp_need = 5600;
        break;
      case 22:
        xp_need = 6000;
        break;
      case 23:
        xp_need = 6400;
        break;
      case 24:
        xp_need = 6800;
        break;
      case 25:
        xp_need = 7200;
        break;
      case 26:
        xp_need = 7600;
        break;
      case 27:
        xp_need = 8000;
        break;
      case 28:
        xp_need = 8400;
        break;
      case 29:
        xp_need = 8800;
        break;
      case 30:
        xp_need = 9200;
        break;
      case 31:
        xp_need = 9800;
        break;
      case 32:
        xp_need = 10400;
        break;
      case 33:
        xp_need = 11000;
        break;
      case 34:
        xp_need = 11600;
        break;
      case 35:
        xp_need = 12200;
        break;
      case 36:
        xp_need = 12800;
        break;
      case 37:
        xp_need = 13400;
        break;
      case 38:
        xp_need = 14000;
        break;
      case 39:
        xp_need = 14600;
        break;
      case 40:
        xp_need = 15200;
        break;
      case 41:
        xp_need = 15800;
        break;
      case 42:
        xp_need = 16400;
        break;
      case 43:
        xp_need = 17000;
        break;
      case 44:
        xp_need = 17600;
        break;
      case 45:
        xp_need = 18200;
        break;
      case 46:
        xp_need = 19000;
        break;
      case 47:
        xp_need = 19800;
        break;
      case 48:
        xp_need = 20600;
        break;
      case 49:
        xp_need = 21400;
        break;
      case 50:
        xp_need = 22500;
        break;
    }

    resolve(xp_need);

  });

}
