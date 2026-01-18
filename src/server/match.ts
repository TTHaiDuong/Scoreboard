// =ARRAYFORMULA(
//  LET(
//   equipmentCheck; "Kiểm giáp";
//   prepare; "Vào trận";
//   inProgress; "Đang thi đấu";
//   end; "Kết thúc";
//   result; L2:L;
//   rows; ROW(result);
//   nCheck; 3;
//   checkFlag: OR(result=prepare; result=inProgress);
//   checkCount; COUNTIF(result; checkFlag);
//   check_rows; IF(checkCount; FILTER(rows; checkFlag); rows*0);
//   checkCond; IF(checkCount;
//            N(rows > TRANSPOSE(check_rows)) * N(rows <= TRANSPOSE(check_rows) + nCheck);
//            N(rows*0)
//          );
//   checkRanges; IF(checkCount; MMULT(checkCond; N(SIGN(check_rows))); N(rows*0));
//   IF(result="_";
//    prepare;
//    IF(AND(LEN(result); checkRanges>0);
//     equipmentCheck;;)
//  )
// )
