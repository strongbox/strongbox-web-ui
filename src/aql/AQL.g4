grammar AQL;

query
:
    queryExp+ orderExp? pageExp? EOF
;

pageExp
:
    PAGE_SKIP COLON NUMBER
;

orderExp
:
    orderDirection COLON orderValue
;

orderValue
:
    STORAGE
    | REPOSITORY
    | LAYOUT
    | VERSION
    | TAG
    | AGE
    | layoutCoordinateKeyword
;

orderDirection
:
    ASC
    | DESC
;

queryExp
:
    tokenPrefix? ROUND_BRACKET_LEFT vNestedQueryExp = queryExp
    ROUND_BRACKET_RIGHT
    | vQueryExpLeft = queryExp logicalOp? vQueryExpRight = queryExp
    | tokenPrefix? tokenExp
;

tokenExp
:
    LAYOUT COLON layoutValue | tokenKey COLON tokenValue
;

tokenPrefix
:
    PLUS
    | NEGATION
    | PLUS NEGATION
;

tokenKey
:
    tokenKeyword
    | layoutCoordinateKeyword
;

layoutValue:
    LAYOUT_MAVEN | LAYOUT_NPM | LAYOUT_NUGET
;

tokenValue
:
    VALUE
    | STRING
;

tokenKeyword
:
    STORAGE
    | REPOSITORY
    | LAYOUT
    | VERSION
    | TAG
    | FROM
    | TO
    | AGE
;

layoutCoordinateKeyword
:




            LAYOUT_COORDINATE_MAVEN_EXTENSION

             | LAYOUT_COORDINATE_MAVEN_GROUPID

             | LAYOUT_COORDINATE_MAVEN_CLASSIFIER

             | LAYOUT_COORDINATE_MAVEN_ARTIFACTID |



            LAYOUT_COORDINATE_NPM_EXTENSION

             | LAYOUT_COORDINATE_NPM_SCOPE

             | LAYOUT_COORDINATE_NPM_NAME |



            LAYOUT_COORDINATE_NUGET_ID

             | LAYOUT_COORDINATE_NUGET_TYPE
;

logicalOp
:
    and
    | or
;

and
:
    AND
    | AMP
    | DOUBLE_AMP
;

or
:
    OR
    | PIPE
    | DOUBLE_PIPE
;



LAYOUT_MAVEN:

    'maven'



    ;

LAYOUT_NPM:

    'npm'



    ;

LAYOUT_NUGET:

    'nuget'



    ;



LAYOUT_COORDINATE_MAVEN_EXTENSION:

        'extension'



        ;

LAYOUT_COORDINATE_MAVEN_GROUPID:

        'groupId'



        ;

LAYOUT_COORDINATE_MAVEN_CLASSIFIER:

        'classifier'



        ;

LAYOUT_COORDINATE_MAVEN_ARTIFACTID:

        'artifactId'



        ;

LAYOUT_COORDINATE_NPM_EXTENSION:

        'extension'



        ;

LAYOUT_COORDINATE_NPM_SCOPE:

        'scope'



        ;

LAYOUT_COORDINATE_NPM_NAME:

        'name'



        ;

LAYOUT_COORDINATE_NUGET_ID:

        'id'



        ;

LAYOUT_COORDINATE_NUGET_TYPE:

        'type'



        ;



STORAGE
:
    'storage'
;

REPOSITORY
:
    'repository'
;

LAYOUT
:
    'layout'
;

VERSION
:
    'version'
;

TAG
:
    'tag'
;

FROM
:
    'from'
;

TO
:
    'to'
;

AGE
:
    'age'
;

ASC
:
    'asc'
;

DESC
:
    'desc'
;

PAGE_SKIP
:
    'skip'
;

AMP
:
    '&'
;

DOUBLE_AMP
:
    '&&'
;

AND
:
    'and'
;

PIPE
:
    '|'
;

DOUBLE_PIPE
:
    '||'
;

OR
:
    'or'
;

PLUS
:
    '+'
;

NEGATION
:
    '!'
    | '~'
;

COLON
:
    ':'
;

ROUND_BRACKET_LEFT
:
    '('
;

ROUND_BRACKET_RIGHT
:
    ')'
;

NUMBER
:
    [0-9]+
;

VALUE
:
    [-_a-zA-Z0-9*.]+
;

STRING
:
    [\\"\\'] ~[\\"\\'\r\n]* [\\"\\']
;

WHITESPACE
:
    [ ] -> skip
;