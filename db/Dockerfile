FROM neo4j:3.4.4

RUN echo 'dbms.security.procedures.unrestricted=apoc.*' >> /var/lib/neo4j/conf/neo4j.conf
RUN mkdir -p /plugins
RUN wget -P /plugins https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.4.0.1/apoc-3.4.0.1-all.jar

