DELIMITER //
CREATE PROCEDURE BALANCE_CALCULATOR(IN IN_WALLET_ID 
INT, OUT RESULT INT) BEGIN 
	SELECT (
	        IFNULL( (
	                SELECT
	                    sum(amount)
	                FROM
	                    transaction
	                WHERE
	                    type = "deposit"
	                    AND wallet_id = in_wallet_id
	            ),
	            0
	        ) + IFNULL( (
	                SELECT
	                    sum(amount)
	                FROM
	                    transaction
	                WHERE
	                    type = "profit"
	                    AND wallet_id = in_wallet_id
	            ),
	            0
	        )
	    ) - (
	        IFNULL( (
	                SELECT
	                    sum(amount)
	                FROM
	                    transaction
	                WHERE
	                    type = "withdrawal"
	                    AND wallet_id = in_wallet_id
	            ),
	            0
	        ) + IFNULL( (
	                SELECT
	                    sum(amount)
	                FROM
	                    transaction
	                WHERE
	                    type = "investment"
	                    AND wallet_id = in_wallet_id
	            ),
	            10
	        )
	    ) as balance INTO RESULT;
	END// 
DELIMITER ;


