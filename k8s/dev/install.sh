#!/bin/bash
kubectl -n gridvo get svc | grep -q data-query
if [ "$?" == "1" ];then
	kubectl create -f data_query-service.yaml --record
	kubectl -n gridvo get svc | grep -q data-query
	if [ "$?" == "0" ];then
		echo "data_query-service install success!"
	else
		echo "data_query-service install fail!"
	fi
else
	echo "data_query-service is exist!"
fi
kubectl -n gridvo get pods | grep -q data-query
if [ "$?" == "1" ];then
	kubectl create -f data_query-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q data-query
	if [ "$?" == "0" ];then
		echo "data_query-deployment install success!"
	else
		echo "data_query-deployment install fail!"
	fi
else
	kubectl delete -f data_query-deployment.yaml
	kubectl -n gridvo get pods | grep -q data-query
	while [ "$?" == "0" ]
	do
	kubectl -n gridvo get pods | grep -q data-query
	done
	kubectl create -f data_query-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q data-query
	if [ "$?" == "0" ];then
		echo "data_query-deployment update success!"
	else
		echo "data_query-deployment update fail!"
	fi
fi
