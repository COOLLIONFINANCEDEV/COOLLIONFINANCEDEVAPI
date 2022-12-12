-- AFTER INSERT

DELIMITER //

CREATE TRIGGER UPDATE_WALLET_BALANCE_AFTER_TRANSACTION_INSERT 
AFTER INSERT ON `transaction`  FOR EACH ROW BEGIN 
	IF NEW.status = "ACCEPTED" THEN
	CALL
	    BALANCE_CALCULATOR(NEW.wallet_id, @balance);
	UPDATE wallet
	SET wallet.amount = @balance
	WHERE
	    wallet.id = NEW.wallet_id;
	END IF;
	END// 


DELIMITER ;

-- AFTER UPDATE

DELIMITER //

CREATE TRIGGER UPDATE_WALLET_BALANCE_AFTER_TRANSACTION_UPDATE 
AFTER UPDATE ON `transaction` FOR EACH ROW BEGIN 
	IF NEW.status = "ACCEPTED" THEN
	CALL
	    BALANCE_CALCULATOR(NEW.wallet_id, @balance);
	UPDATE wallet
	SET wallet.amount = @balance
	WHERE
	    wallet.id = NEW.wallet_id;
	END IF;
	IF OLD.amount <> NEW.amount THEN
	UPDATE `transaction`
	SET amount = OLD.amount;
	END IF;
	END// 


DELIMITER ;